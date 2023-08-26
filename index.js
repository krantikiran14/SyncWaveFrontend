const dropZone = document.querySelector(".drop-zone")
const browsebtn = document.querySelector(".browsebtn")
const fileinput = document.querySelector("#fileinput")
const progressContainer = document.querySelector(".progress-container")
const bgProgress = document.querySelector(".bg-progress")
const progressBar = document.querySelector(".progress-bar")
const percentDiv = document.querySelector("#percent")
const fileURlInput = document.querySelector("#fileURL")
const copyBtn = document.querySelector("#copyBtn")
const emailFrom = document.querySelector("#emailFrom")
const sharingContainer = document.querySelector(".sharing-container")
const toast = document.querySelector(".toast");

const host = "https://synwave1.onrender.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024;


dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault()
   if(!dropZone.classList.contains("dragged")) 
    dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", ()=>{
dropZone.classList.remove("dragged")
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged")
    const files = e.dataTransfer.files
    fileinput.files = files;
    if(files.length){
        fileinput.files=files;
        uploadFile();
    }
});

fileinput.addEventListener("change", ()=>{
    uploadFile()
})

browsebtn.addEventListener("click", ()=>{
    fileinput.click()
});

copyBtn.addEventListener("click", ()=>{
    fileURlInput.select()
    document.execCommand("copy")
    showToast("Copied to Clipboard")
})

const uploadFile = ()=>{
    const file = fileinput.files[0];
    if (file.sizen > maxAllowedSize){
        showToast("Can't upload more than 100mb");
        resetfileinput();
        return;
    }
    
    progressContainer.style.display = "block";
    if(fileinput.files.length>1){
        fileinput.value = "";
        showToast("Only Upload 1 File")
        return
    }
    sharingContainer.style.display = "none";
    const formData = new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            console.log(xhr.response)
            onUploadSucess(JSON.parse(xhr.response))
        }
        
    };

   xhr.upload.onprogress = updateProgress; 
   xhr.upload.onerror = ()=>{
    fileinput.value ="";
    showToast(`Error in Upload ${xhr.statusText}`)
   }
   xhr.open("POST", uploadURL);
   xhr.send(formData);

};

const updateProgress = (e) =>{
    const percent = Math.round((e.loaded/e.total)*100);
    //console.log(percent);
    bgProgress.style.width= `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`
};

const onUploadSucess = ({file:url}) =>{
    console.log(url);
    resetfileinput();

    emailFrom[2].removeAttribute("disabled");
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURlInput.value=url;

};

const  resetfileinput = () =>{

}

emailFrom.addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log("Submit form");
    const url =fileURlInput.value
    const formData = {
        
        emailTo: emailFrom.elements["to-email"].value,
        emailFrom: emailFrom.elements["from-email"].value,
        uuid:url.split("/").splice(-1,1)[0]
        
    };
    console.log(formData);
    emailFrom[2].setAttribute("disabled", "true");

    fetch(emailURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            
            sharingContainer.style.display = "none"; // hide the box
            showToast("Email Sent");
        }
        });


});

let toastTimer;
// the toast function
const showToast = (msg) => {
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  };
      
      
      
      
      


