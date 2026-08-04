const id=new URLSearchParams(location.search).get("id");
const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el};
function paragraphElement(block){
  const paragraph=make("p","print-paragraph");
  const lines=block.split("\n");
  if(/^\[(성경|말씀|기도|언약기도)\]$/.test(lines[0]?.trim())){
    paragraph.append(make("span","print-section-label",lines.shift().trim()));
    if(lines.length)paragraph.append(document.createTextNode("\n"));
  }
  paragraph.append(document.createTextNode(lines.join("\n")));
  return paragraph;
}
fetch("./data/sermons.json?v=archive-2").then(r=>r.json()).then(items=>{
  const x=items.find(v=>String(v.id)===String(id));if(!x)throw 0;
  const[y,m,d]=x.date.split("-").map(Number);document.title=`${x.title} · 인쇄`;
  const root=document.getElementById("print-root");
  const actions=make("div","print-toolbar");const button=make("button","quiet-btn","PDF 저장 · 인쇄");button.type="button";button.onclick=()=>window.print();actions.append(make("span","print-toolbar-note","A4 인쇄용 보기"),button);
  const header=make("header","print-header");header.append(make("p","print-meta",`${x.category} · ${y}. ${m}. ${d}.`),make("h1","print-title",x.title));
  if(x.passage)header.append(make("p","print-passage",x.passage));
  const content=make("section","print-content");content.setAttribute("aria-label","말씀 녹취록");
  x.content.split(/\n{2,}/).map(v=>v.trim()).filter(Boolean).forEach(block=>content.append(paragraphElement(block)));
  root.replaceChildren(actions,header,content);
}).catch(()=>document.getElementById("print-root").textContent="말씀을 찾을 수 없습니다.");
