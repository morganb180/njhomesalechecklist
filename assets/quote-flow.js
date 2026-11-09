/* Stepped quote form. Does not change field names, the endpoint, Turnstile, or consent.
   The lead router chooses recipients after submit. The only firm named before submit is the
   one the visitor already opened (?firm=), which lead.js writes into the firm field when
   that id is in NET_FIRMS. */
(function(){
  var form=document.querySelector("form.qflow[data-lead]");
  if(!form)return;
  var steps=Array.prototype.slice.call(form.querySelectorAll(".qstep"));
  var n=steps.length;
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function on(){for(var i=0;i<n;i++)if(steps[i].classList.contains("is-on"))return i;return 0}
  function show(k,doFocus){
    if(k<0||k>=n)return;
    steps.forEach(function(s,i){s.classList.toggle("is-on",i===k)});
    var prog=document.getElementById("qprog"),meter=document.getElementById("qmeter"),bar=meter&&meter.querySelector("span");
    if(prog)prog.textContent="Question "+(k+1)+" of "+n;
    if(meter)meter.setAttribute("aria-valuenow",String(k+1));
    if(bar)bar.style.width=Math.round((k+1)/n*100)+"%";
    if(doFocus){
      var legend=steps[k].querySelector("legend");
      if(legend){legend.setAttribute("tabindex","-1");legend.focus()}
    }
  }
  function stepValid(step){
    var els=step.querySelectorAll("input,select,textarea"),j;
    for(j=0;j<els.length;j++){
      if(els[j].disabled||els[j].type==="hidden"||els[j].type==="radio"||els[j].type==="checkbox"){
        if(els[j].type==="radio"&&els[j].required){
          var group=step.querySelectorAll('input[name="'+els[j].name+'"]'),any=false,g;
          for(g=0;g<group.length;g++)if(group[g].checked)any=true;
          if(!any){els[j].reportValidity();return false}
        }
        continue;
      }
      if(!els[j].checkValidity()){els[j].reportValidity();return false}
    }
    return true;
  }
  form.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest("button");
    if(!t||!form.contains(t))return;
    var i=on();
    if(t.classList.contains("qnext")){
      e.preventDefault();
      if(!stepValid(steps[i]))return;
      show(i+1,true);render();
    }else if(t.classList.contains("qback")){e.preventDefault();show(i-1,true)}
  });
  form.addEventListener("keydown",function(e){
    if(e.key!=="Enter"||e.target.tagName==="TEXTAREA"||!form.classList.contains("is-stepped"))return;
    var step=e.target.closest&&e.target.closest(".qstep");
    if(!step||!step.classList.contains("is-on"))return;
    if(on()<n-1){e.preventDefault();var btn=step.querySelector(".qnext");if(btn)btn.click()}
  });
  form.addEventListener("invalid",function(e){
    var s=e.target.closest&&e.target.closest(".qstep");
    if(!s)return;
    var idx=steps.indexOf(s);
    if(idx>=0)show(idx,false);
  },true);
  function checked(name){return form.querySelector('[name="'+name+'"]:checked')}
  function field(name){return form.querySelector('[name="'+name+'"]')}
  function needLabel(){
    var el=checked("need");
    if(!el)return "";
    var b=el.parentNode.querySelector("b");
    return b?b.textContent:el.value;
  }
  var COUNTIES={"atlantic":"Atlantic","bergen":"Bergen","burlington":"Burlington","camden":"Camden","cape-may":"Cape May","cumberland":"Cumberland","essex":"Essex","gloucester":"Gloucester","hudson":"Hudson","hunterdon":"Hunterdon","mercer":"Mercer","middlesex":"Middlesex","monmouth":"Monmouth","morris":"Morris","ocean":"Ocean","passaic":"Passaic","salem":"Salem","somerset":"Somerset","sussex":"Sussex","union":"Union","warren":"Warren"};
  function countyLabel(){
    var slug=(new URLSearchParams(location.search).get("county")||"").toLowerCase();
    return COUNTIES[slug]?COUNTIES[slug]+" County":"";
  }
  function firmName(){
    var id=(field("firm")||{}).value||"";
    var row=id&&window.NET_FIRMS&&NET_FIRMS[id];
    return row?row[0]:"";
  }
  function whoText(){
    var fn=firmName();
    if(fn)return "We connect you with "+fn+" and up to 2 other nearby NJ DCA-certified lead evaluation contractors. They contact you directly. The others are chosen when you send this form, and their names appear on the next screen. Contractors can't pay to be picked.";
    var where=countyLabel();
    return "We connect you with up to 3 nearby NJ DCA-certified lead evaluation contractors"+(where?" in "+where:"")+". They contact you directly. They are chosen when you send this form. A listing you were reading is not reserved. You will see the names on the next screen. Contractors can't pay to be picked.";
  }
  function buttonText(){
    var fn=firmName();
    if(fn)return "We connect you with "+fn+" and up to 2 other nearby NJ DCA-certified lead evaluation contractors. They contact you directly. NJ Home Sale Checklist is a directory, not a contractor. No obligation to hire.";
    var where=countyLabel();
    return "We connect you with up to 3 nearby NJ DCA-certified lead evaluation contractors"+(where?" in "+where:"")+". They contact you directly. Their names appear on the next screen. This does not reserve one listing. NJ Home Sale Checklist is a directory, not a contractor. No obligation to hire.";
  }
  function render(){
    var rows=[];
    var need=needLabel();if(need)rows.push(["Service",need]);
    var county=countyLabel();if(county)rows.push(["County",county]);
    var zip=(field("zip")||{}).value||"";if(zip)rows.push(["ZIP",zip]);
    var name=(field("name")||{}).value||"";if(name)rows.push(["Name",name]);
    var sum=document.getElementById("qsum");
    if(sum){
      sum.innerHTML=rows.length?("<dl>"+rows.map(function(r){return "<div><dt>"+esc(r[0])+"</dt><dd>"+esc(r[1])+"</dd></div>"}).join("")+"</dl>"):'<p class="muted">Nothing entered yet.</p>';
    }
    var rec=document.getElementById("qrec");if(rec)rec.textContent=whoText();
    var who=document.getElementById("qwho");if(who)who.textContent=buttonText();
  }
  var params=new URLSearchParams(location.search);
  var need=params.get("need");
  if(need){
    var radios=form.querySelectorAll("[name=need]"),r;
    for(r=0;r<radios.length;r++)if(radios[r].value===need){radios[r].checked=true;break}
  }
  var zip=params.get("zip");
  if(zip&&/^\d{5}$/.test(zip)&&field("zip"))field("zip").value=zip;
  form.addEventListener("input",render);
  form.addEventListener("change",render);
  form.addEventListener("lead:result",function(e){
    var d=e.detail||{};
    if(!d.ok)return;
    var panel=document.getElementById("qpanel");
    if(!panel)return;
    panel.innerHTML='<h2>Connected with</h2><p>The contractors named in the confirmation are the ones this request was shared with. They contact you directly.</p><ul class="qpriv"><li>A copy of the request stays with NJ Home Sale Checklist so we can run the service.</li><li>To delete that copy, contact <a href="mailto:hello@njhomesalechecklist.com">hello@njhomesalechecklist.com</a>. Contractors keep what they received under their own policies.</li></ul>';
  });
  var more=document.querySelector(".qmore");
  if(more&&window.matchMedia("(max-width:900px)").matches)more.open=false;
  var pre=document.getElementById("countypre");
  if(pre&&countyLabel()){pre.hidden=false;pre.textContent="Starting in "+countyLabel()+". Nearby contractors are chosen when you send this form. This does not reserve a listing you were reading.";}
  show(on(),false);
  render();
})();
