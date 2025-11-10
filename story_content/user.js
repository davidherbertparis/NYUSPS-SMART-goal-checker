window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  (function(){
  var p = GetPlayer();
  var nm = (p.GetVar("Name") || "").trim();

  // Keep first word; allow accents/apostrophes/hyphens; strip odd chars
  nm = nm.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g,"").split(/\s+/)[0];

  // Fallback if blank
  if (!nm) nm = "there";

  // Write back to the SAME variable (you said: Name only)
  p.SetVar("Name", nm);
})();

}

window.Script2 = function()
{
  (function(){
  var p = GetPlayer();
  if (!(p.GetVar('SessionId')||'').trim()){
    function uuid(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});}
    p.SetVar('SessionId', uuid());
  }
})();

}

window.Script3 = function()
{
  (function () {
  var p = GetPlayer();

  // Clean first name (fallback to "there") and persist
  var n = (p.GetVar("Name") || "").trim()
            .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g,"")
            .split(/\s+/)[0] || "there";
  p.SetVar("Name", n);
  var key = n.toLowerCase();

  // First-name (lowercase) → { role (optional), example }
  var roster = {
    // UPDATED ROLES
    "grace":   { role: "Special Projects Advisor",
                 example: "By Nov 25, deliver 3 project milestones on time (from 2/3 last cycle) by adding a weekly stand-up and RACI check (project tracker)." },

    "rachel":  { role: "Human Resources Coordinator",
                 example: "By Dec 15, raise onboarding task completion from 70% to 92% by adding a day-3 reminder and manager checklist (HRIS/LMS reports)." },

    "molly":   { role: "transitioning educator",
                 example: "By Dec 10, complete 2 portfolio case studies and 1 micro-credential, and submit 3 tailored applications (portfolio tracker)." },

    "su-feng": { role: "Senior Director of Global Insights & Analytics",
                 example: "By Dec 5, increase dashboard weekly active users from 18 to 35 by adding release notes and a 2-min loom walkthrough (BI usage logs)." },

    "payal":   { role: "Study Away Administrator at NYU",
                 example: "By Dec 20, lift pre-departure orientation attendance from 78% to 92% via calendar holds and 48-hour reminders (attendance records)." },

    // Existing entries (kept as before)
    "diana":   { role: "veterinary surgical training assistant",
                 example: "By Nov 30, raise catheter-placement pass rate from 60% to 85% via a 3-step checklist and supervised practice (skills rubric records)." },
    "ksenia":  { role: "instructional designer",
                 example: "By Dec 12, boost peer-review completion from 55% to 80% with clear deadlines and auto-assigned partners (platform reports)." },
    "izzy":    { role: "support specialist",
                 example: "By Dec 1, cut ticket response time median from 6h to 3h by using a triage macro and daily stand-up review (helpdesk metrics)." },
    "nicolas": { role: "videographer",
                 example: "By Nov 30, increase portfolio case-study views from 120 to 240 by adding a teaser clip and CTA on the homepage (web analytics)." },
    "dave":    { role: "professor at NYU",
                 example: "By Dec 10, raise live-session interaction rate from 45% to 75% by adding two gamified activities and 60-sec reflections (Zoom analytics)." },
    "david":   { role: "professor at NYU",
                 example: "By Dec 10, raise live-session interaction rate from 45% to 75% by adding two gamified activities and 60-sec reflections (Zoom analytics)." },

    // Keep a few you had earlier if needed:
    "sarah":   { role: "NYU instructor",
                 example: "By Dec 10, improve on-time assignment submissions from 72% to 90% by adding milestone reminders and a rubric preview (NYU LMS data)." }
  };

  // Default if name not in roster
  var defaultEx = "By Dec 15, increase course completion from 62% to 85% using weekly nudges and a manager reminder (LMS reports).";

  // Build the “as a …” phrase only when role exists
  var row = roster[key] || {};
  var rolePhrase = row.role ? `, as a ${row.role},` : "";
  var exCore = row.example || defaultEx;
  var prefill = `Example for you, ${n}${rolePhrase}: ${exCore}`;

  // Prefill only if the learner hasn’t typed anything yet
  var cur = (p.GetVar("Learner_SMART_goal") || "").trim();
  if (!cur) p.SetVar("Learner_SMART_goal", prefill);
})();

}

window.Script4 = function()
{
  setTimeout(function(){
  // use the accessibility name you set on the text entry
  var el = document.querySelector('input[aria-label="goal-entry"], textarea[aria-label="goal-entry"]');
  if (el) el.focus();
}, 0);

}

window.Script5 = function()
{
  (function () {
  var p = GetPlayer();
  var s = +p.GetVar("S_Pct") || 0;
  var m = +p.GetVar("M_Pct") || 0;
  var a = +p.GetVar("A_Pct") || 0;
  var r = +p.GetVar("R_Pct") || 0;
  var t = +p.GetVar("T_Pct") || 0;
  p.SetVar("Overall_Pct", Math.round((s + m + a + r + t) / 5));
})();

}

window.Script6 = function()
{
  (function () {
  var p = GetPlayer();
  var keys = ["S", "M", "A", "R", "T", "Overall"]; // will animate X_Anim → X_Pct
  var dur = 800; // ms

  function easeOut(t){ return 1 - Math.pow(1 - t, 3); }

  function animateVar(animName, targetPct){
    var from = +p.GetVar(animName) || 0;
    var to = Math.max(0, Math.min(100, Math.round(+targetPct || 0)));
    var start = performance.now();

    function step(t){
      var k = Math.min(1, (t - start) / dur);
      var val = Math.round(from + (to - from) * easeOut(k));
      p.SetVar(animName, val);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  keys.forEach(function(k){
    var animName = (k === "Overall") ? "Overall_Anim" : (k + "_Anim");
    var pctName  = (k === "Overall") ? "Overall_Pct"  : (k + "_Pct");
    animateVar(animName, p.GetVar(pctName));
  });
})();

}

window.Script7 = function()
{
  (function () {
  var p = GetPlayer();
  var keys = ["S", "M", "A", "R", "T", "Overall"];
  var t0 = performance.now();
  var dur = 950;              // slightly longer than the animator
  var STEP = 5;               // change to 2.5 or 1 if you later add more states

  function snap(){
    keys.forEach(function(k){
      var anim = (k === "Overall") ? "Overall_Anim"   : (k + "_Anim");
      var buck = (k === "Overall") ? "Overall_Bucket" : (k + "_Bucket");

      var s = +p.GetVar(anim) || 0;
      var bucket = Math.round(s / STEP) * STEP;
      bucket = Math.max(0, Math.min(100, bucket));

      if (bucket !== +p.GetVar(buck)) p.SetVar(buck, bucket);
    });

    if (performance.now() - t0 < dur) requestAnimationFrame(snap);
  }
  requestAnimationFrame(snap);
})();

}

window.Script8 = function()
{
  (function () {
  var p = GetPlayer();

  // Ensure a SessionId exists (once per session)
  if (!(p.GetVar('SessionId') || '').trim()) {
    function uuid(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});}
    p.SetVar('SessionId', uuid());
  }

  // Clamp helper: 0–100 ints
  function n(v){ v=+v; return isFinite(v)?Math.max(0,Math.min(100,Math.round(v))):0; }

  // Build payload from Storyline vars
  var payload = {
    token: 'change-me-32chars',                   // MUST match SHARED_TOKEN in Apps Script
    session_id: p.GetVar('SessionId') || '',
    name: (p.GetVar('Name') || '').trim(),
    goal: (p.GetVar('Learner_SMART_goal') || '').trim(),
    S: n(p.GetVar('S_Pct')),
    M: n(p.GetVar('M_Pct')),
    A: n(p.GetVar('A_Pct')),
    R: n(p.GetVar('R_Pct')),
    T: n(p.GetVar('T_Pct')),
    overall: n(p.GetVar('Overall_Pct')),
    feedback: (p.GetVar('FeedbackTxt') || '').trim()
  };

  // UI status (bind a text box to %ShareStatus%)
  p.SetVar('ShareStatus', 'Sharing…');

  // Use text/plain to avoid CORS preflight
  fetch('https://script.google.com/macros/s/AKfycbyn9XAUFVxZa5eo66Xpv4Kaz1dNfJd3shjYpc2-D1j0itOfltyKneBkPiWy2fbpBkmenQ/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
  .then(function(r){ return r.text(); })
  .then(function(t){
    var j = null; try { j = JSON.parse(t); } catch(e){}
    if (j && j.ok) {
      p.SetVar('ShareStatus', 'Shared with your facilitator.');
    } else {
      p.SetVar('ShareStatus', 'Could not share (' + (j && j.error ? j.error : 'no response') + ').');
    }
  })
  .catch(function(err){
    console.error('Share error:', err);
    p.SetVar('ShareStatus', 'Could not share right now.');
  });
})();

}

window.Script9 = function()
{
  (function () {
  var p   = GetPlayer();
  var rawGoal = (p.GetVar("Learner_SMART_goal") || "").trim();
  var name = (p.GetVar("Name") || "").trim();

  // 1) If the goal still includes the example wrapper, strip it
  var goal = rawGoal.replace(/^Example for you,[^:]*:\s*/i, "").trim();

  if (!goal) {
    p.SetVar("FeedbackTxt", "Please enter a goal first.");
    return;
  }

  // 2) Optional: tiny role context (same roles you used on the goal slide)
  var key = (name || "").toLowerCase();
  var roles = {
    "grace":"Special Projects Advisor",
    "rachel":"Human Resources Coordinator",
    "molly":"transitioning educator",
    "su-feng":"Senior Director of Global Insights & Analytics",
    "payal":"Study Away Administrator at NYU",
    "diana":"veterinary surgical training assistant",
    "ksenia":"instructional designer",
    "izzy":"support specialist",
    "nicolas":"videographer",
    "dave":"professor at NYU",
    "david":"professor at NYU",
    "sarah":"NYU instructor"
  };
  var context = roles[key] ? ("Role: " + roles[key]) : "";

  // --- unchanged below here, except we also send {context} ---
  var ctrl = new AbortController();
  setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, 15000);
  function n(v){ v=+v; if(!isFinite(v)) v=0; return Math.max(0, Math.min(100, Math.round(v))); }

  fetch("https://SMART-Goal-NYU.replit.app/score-smart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, goal: goal, context: context }), // <— added context
    mode: "cors",
    signal: ctrl.signal
  })
  .then(function(r){ if(!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
  .then(function(r){
    p.SetVar("S_Pct", n(r.S)); p.SetVar("M_Pct", n(r.M)); p.SetVar("A_Pct", n(r.A));
    p.SetVar("R_Pct", n(r.R)); p.SetVar("T_Pct", n(r.T));

    var overall = ("overall" in r) ? n(r.overall)
      : n(( (+p.GetVar("S_Pct")) + (+p.GetVar("M_Pct")) + (+p.GetVar("A_Pct")) + (+p.GetVar("R_Pct")) + (+p.GetVar("T_Pct")) ) / 5);
    p.SetVar("Overall_Pct", overall);

    var fb = (r.feedback || "").trim();
    if (!fb) fb = (name||"there") + ", here are your SMART scores. Focus on the weakest areas with concrete fixes.";
    p.SetVar("FeedbackTxt", fb);

    p.SetVar("HasResult", true);
    var jump = document.querySelector('[aria-label="hidden-jump-to-results"]');
    if (jump) jump.click();
  })
  .catch(function(err){
    console.error("SMART service error:", err);
    p.SetVar("FeedbackTxt", "We couldn't reach the scoring service. Please try again.");
    p.SetVar("S_Pct",0); p.SetVar("M_Pct",0); p.SetVar("A_Pct",0); p.SetVar("R_Pct",0); p.SetVar("T_Pct",0);
    p.SetVar("Overall_Pct",0);
  });
})();

}

window.Script10 = function()
{
  (function () {
  var p = GetPlayer();

  // prevent double-start if the timeline restarts
  if (p.GetVar('DidStartFetch') === true) return;
  p.SetVar('DidStartFetch', true);

  p.SetVar('IsLoading', true);
  p.SetVar('HasResult', false);
  p.SetVar('LastError', '');
  p.SetVar('LoadingHint', 'Scoring your goal…');

  var name = (p.GetVar('Name') || '').trim();
  var goal = (p.GetVar('Learner_SMART_goal') || '').trim();

  if (!goal) {
    p.SetVar('FeedbackTxt', 'Please enter a goal first.');
    p.SetVar('IsLoading', false);
    return;
  }

  function n(v){ v=+v; return isFinite(v)?Math.max(0,Math.min(100,Math.round(v))):0; }

  function attempt(timeoutMs){
    return new Promise(function(resolve,reject){
      var ctrl = new AbortController();
      var t = setTimeout(function(){ try{ctrl.abort();}catch(e){} }, timeoutMs);

      fetch('https://SMART-Goal-NYU.replit.app/score-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, goal: goal }),
        mode: 'cors',
        signal: ctrl.signal
      })
      .then(function(r){ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
      .then(resolve)
      .catch(function(err){ clearTimeout(t); reject(err); });
    });
  }

  // --- WATCHDOG: force-exit if we somehow never resolve after ~16s ---
  var watchdog = setTimeout(function(){
    if (!p.GetVar('HasResult')) {
      p.SetVar('FeedbackTxt', 'We couldn’t reach the scoring service just now. Please try “Check My Goal” again.');
      p.SetVar('LastError', 'watchdog-timeout');
      p.SetVar('IsLoading', false);  // triggers your fallback jump back to Goal Entry
    }
  }, 16000);

  setTimeout(function(){
    // Try once (8s), then retry once after 600ms (12s)
    attempt(8000).catch(function(){
      p.SetVar('LoadingHint','Retrying…');
      return new Promise(res=>setTimeout(res,600)).then(()=>attempt(12000));
    })
    .then(function(r){
      clearTimeout(watchdog);

      p.SetVar('S_Pct', n(r.S));
      p.SetVar('M_Pct', n(r.M));
      p.SetVar('A_Pct', n(r.A));
      p.SetVar('R_Pct', n(r.R));
      p.SetVar('T_Pct', n(r.T));
      var overall = ('overall' in r) ? n(r.overall)
        : n((+p.GetVar('S_Pct') + +p.GetVar('M_Pct') + +p.GetVar('A_Pct') + +p.GetVar('R_Pct') + +p.GetVar('T_Pct'))/5);
      p.SetVar('Overall_Pct', overall);

      var fb = (r.feedback || '').trim();
      if (!fb) {
        var nm = name || 'there';
        fb = nm + ', here are your SMART scores. Tighten the weakest areas and add any missing numbers or deadlines.';
      }
      p.SetVar('FeedbackTxt', fb);

      p.SetVar('HasResult', true);     // your “Jump to Results when HasResult==True” trigger fires
    })
    .catch(function(err){
      clearTimeout(watchdog);

      console.error('SMART scoring failed:', err);
      p.SetVar('LastError', String(err));
      p.SetVar('FeedbackTxt', 'We couldn’t reach the scoring service. Please try “Check My Goal” again.');
      p.SetVar('S_Pct',0); p.SetVar('M_Pct',0); p.SetVar('A_Pct',0); p.SetVar('R_Pct',0); p.SetVar('T_Pct',0);
      p.SetVar('Overall_Pct',0);
      // HasResult stays false → your fallback jump back to Goal Entry will fire when IsLoading flips false
    })
    .finally(function(){
      p.SetVar('IsLoading', false);    // always clear loader
    });
  }, 50);
})();

}

window.Script11 = function()
{
  (function () {
  var p   = GetPlayer();
  var rawGoal = (p.GetVar("Learner_SMART_goal") || "").trim();
  var name = (p.GetVar("Name") || "").trim();

  // 1) If the goal still includes the example wrapper, strip it
  var goal = rawGoal.replace(/^Example for you,[^:]*:\s*/i, "").trim();

  if (!goal) {
    p.SetVar("FeedbackTxt", "Please enter a goal first.");
    return;
  }

  // 2) Optional: tiny role context (same roles you used on the goal slide)
  var key = (name || "").toLowerCase();
  var roles = {
    "grace":"Special Projects Advisor",
    "rachel":"Human Resources Coordinator",
    "molly":"transitioning educator",
    "su-feng":"Senior Director of Global Insights & Analytics",
    "payal":"Study Away Administrator at NYU",
    "diana":"veterinary surgical training assistant",
    "ksenia":"instructional designer",
    "izzy":"support specialist",
    "nicolas":"videographer",
    "dave":"professor at NYU",
    "david":"professor at NYU",
    "sarah":"NYU instructor"
  };
  var context = roles[key] ? ("Role: " + roles[key]) : "";

  // --- unchanged below here, except we also send {context} ---
  var ctrl = new AbortController();
  setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, 15000);
  function n(v){ v=+v; if(!isFinite(v)) v=0; return Math.max(0, Math.min(100, Math.round(v))); }

  fetch("https://SMART-Goal-NYU.replit.app/score-smart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, goal: goal, context: context }), // <— added context
    mode: "cors",
    signal: ctrl.signal
  })
  .then(function(r){ if(!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
  .then(function(r){
    p.SetVar("S_Pct", n(r.S)); p.SetVar("M_Pct", n(r.M)); p.SetVar("A_Pct", n(r.A));
    p.SetVar("R_Pct", n(r.R)); p.SetVar("T_Pct", n(r.T));

    var overall = ("overall" in r) ? n(r.overall)
      : n(( (+p.GetVar("S_Pct")) + (+p.GetVar("M_Pct")) + (+p.GetVar("A_Pct")) + (+p.GetVar("R_Pct")) + (+p.GetVar("T_Pct")) ) / 5);
    p.SetVar("Overall_Pct", overall);

    var fb = (r.feedback || "").trim();
    if (!fb) fb = (name||"there") + ", here are your SMART scores. Focus on the weakest areas with concrete fixes.";
    p.SetVar("FeedbackTxt", fb);

    p.SetVar("HasResult", true);
    var jump = document.querySelector('[aria-label="hidden-jump-to-results"]');
    if (jump) jump.click();
  })
  .catch(function(err){
    console.error("SMART service error:", err);
    p.SetVar("FeedbackTxt", "We couldn't reach the scoring service. Please try again.");
    p.SetVar("S_Pct",0); p.SetVar("M_Pct",0); p.SetVar("A_Pct",0); p.SetVar("R_Pct",0); p.SetVar("T_Pct",0);
    p.SetVar("Overall_Pct",0);
  });
})();

}

};
