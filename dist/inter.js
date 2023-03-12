let linkInp,cloneofLinkInp,eventURL = new Set();
let all = true
const autofill = (node) => {
    console.log("shit")
    let elementIds = Object.keys(localStorage);
    console.log({elementIds})
    for(const elementId of elementIds){
        if(elementId=="all"){
            all = localStorage.getItem("all")
            if(all=="true"){
                document.querySelector(".all").style.background="red";
            }else if(all="false"){
                document.querySelector(".custom").style.background="red";
            }
            continue
        }
        if(elementId=="eventURL"){
            eventURL = JSON.parse(localStorage.getItem(elementId))
            if(eventURL.length<1){continue}
            let parent = document.querySelector(".linkInp")
            const cloneLast = parent.cloneNode(true) 
            parent.querySelector("div").style.background="red"
            parent.querySelector("div").innerHTML="-"
            let nexClone = parent.cloneNode(true)
            parent.remove()
            for(let i=0;i<eventURL.length;i++){
                let temp = nexClone.cloneNode(true)
                nexClone.style.display = "flex"
                nexClone.querySelector("input").value = eventURL[i]
                console.log(nexClone.querySelector("input").value)
                console.log(document.querySelector(".listoflinks").appendChild(nexClone))
                nexClone = temp;    
            }
            cloneLast.style.display = "flex"
            document.querySelector(".listoflinks").appendChild(cloneLast)
            eventURL=new Set(eventURL)
            continue
        }
        try{
            document.querySelector(`#${elementId}`).value=localStorage.getItem(elementId)
        }catch(e){
            console.log({elementId},e)
        }
    }
}
const allBtnclick = ()=>{
    all = true
    let allBtn = document.querySelector(".all");
    let customBtn = document.querySelector(".custom");
    allBtn.style.background = "red"
    customBtn.style.background = "rgb(251 113 133)"
    document.querySelector(".listoflinks").style.display="none"
}
const customBtnclick = ()=>{
    all = false
    document.querySelector(".listoflinks").style.display="block"
    let allBtn = document.querySelector(".all");
    let customBtn = document.querySelector(".custom");
    allBtn.style.background = "rgb(251 113 133)"
    customBtn.style.background = "red"
    let node = document.querySelector(".linkInp")
    node.style.display = "flex"
}
const moreLinks = (ele)=>{
    console.log({eventURL})
    const parentNode = ele.parentNode;
    let val = ele.innerHTML;
    let inpval = parentNode.querySelector("input").value;
    if(inpval==""){alert("add the group link !!")}
    else if(val=="+"){
        eventURL.add(inpval)
        cloneofLinkInp = parentNode.cloneNode(true)
        ele.style.background="red";
        ele.innerHTML="-"
        cloneofLinkInp.style.display = "flex"
        cloneofLinkInp.querySelector("input").value = ""
        document.querySelector(".listoflinks").appendChild(cloneofLinkInp);
    }else if(val=="-"){
        eventURL.delete(inpval)
        parentNode.remove()
    }
}
let form = document.querySelector("form")
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log({form})
    let formData = new FormData(form);
    console.log("before",...formData)
    let groupURL = [...eventURL]
    formData.append("all",all)
    formData.append("eventURL",JSON.stringify(groupURL))
    for(const [key,value] of formData){
        localStorage[key]=value
    }
    console.log("after",...formData)
    fetch("/post-meetup-details",{
        method:"POST",
        body:formData
    })
})