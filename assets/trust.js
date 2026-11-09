/* Promotes the DCA cert number already printed on a card into a credential chip. No new facts. */
(function(){
  var cards=document.querySelectorAll(".card[id],.firm");
  for(var i=0;i<cards.length;i++){
    var card=cards[i];
    if(card.querySelector(".cred"))continue;
    var m=/DCA cert #(\d+)/.exec(card.textContent||"");
    if(!m)continue;
    var el=document.createElement("span");
    el.className="cred";
    el.textContent="DCA #"+m[1];
    var h=card.querySelector("h3");
    if(h)h.parentNode.insertBefore(el,h);
    else card.insertBefore(el,card.firstChild);
  }
})();
