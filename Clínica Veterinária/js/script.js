
document.addEventListener("DOMContentLoaded", function() {
  let waitingList = [];
  let attendingPatient = null;

  const form = document.querySelector("form");
  const nameInput = document.getElementById("name");
  const fileInput = document.getElementById("file-upload");
  const btnAdd = document.getElementById("btnAdd");
  const btnUrg = document.getElementById("btnUrg");
  const btnAtt = document.getElementById("btnAtt");
  const attendDiv = document.querySelector(".attend");
  const waitingDiv = document.querySelector(".waiting");

  function updateUI() {
    attendDiv.innerHTML = "<h2>Em Atendimento:</h2>";
    if (attendingPatient) {
      const attendContent = document.createElement("div");
      attendContent.classList.add("attending");

      if (attendingPatient.urgency) {
      attendContent.classList.add("attending-urgent");
      }

      const patientInfo = document.createElement("p");
      patientInfo.textContent = "Paciente: " + attendingPatient.name;
      const patientTime = document.createElement("span");
      patientTime.textContent = " (Horário: " + attendingPatient.time + ")";
      patientInfo.appendChild(patientTime);

      attendContent.appendChild(patientInfo);

      if (attendingPatient.image) {
        const img = document.createElement("img");
        img.src = attendingPatient.image;
        img.alt = attendingPatient.name;
        img.classList.add("attending-img");
        attendContent.appendChild(img);
        attendContent.appendChild(img);
      }
      attendDiv.appendChild(attendContent);
    }

    waitingDiv.innerHTML = "<h2>Aguardando o Atendimento:</h2>";
    if (waitingList.length > 0) {
      const ul = document.createElement("ul");
      waitingList.forEach(function(patient){
        const li = document.createElement("li");
          if (patient.urgency) {
          li.classList.add("urgent");
        }
        li.textContent = patient.name + " (Adicionado às " + patient.time + ")";
         if (patient.image) {
          const thumb = document.createElement("img");
          thumb.src = patient.image;
          thumb.alt = patient.name;
          thumb.classList.add("patient-thumb");
          li.appendChild(thumb);
        }
        ul.appendChild(li);
      });
      waitingDiv.appendChild(ul);
    }
    
  }

  function addPatient(isUrgency) {
    const name = nameInput.value.trim();
    if (name === "") {
      alert("Por favor, insira o nome do paciente.");
      return;
    }
    if (fileInput.files.length === 0) {
      alert("Por favor, selecione uma imagem do paciente.");
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const base64Image = e.target.result;
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = {
        name: name,
        image: base64Image,
        time: currentTime,
        urgency: isUrgency
      };

      if (isUrgency) {
        waitingList.unshift(patient);
      } else {
        waitingList.push(patient);
      }

      localStorage.setItem("paciente_" + name, JSON.stringify(patient));

      updateUI();

      nameInput.value = "";
      fileInput.value = "";
    };

    reader.readAsDataURL(file);
  }

  btnAdd.addEventListener("click", function(e) {
    e.preventDefault(); 
    addPatient(false);
  });

  btnUrg.addEventListener("click", function(e) {
    e.preventDefault();
    addPatient(true);
  });

  btnAtt.addEventListener("click", function(e) {
    e.preventDefault();
    if (waitingList.length === 0) {
      attendingPatient = null;
      updateUI();
      alert("Não há pacientes na lista de espera.");
      return;
    }
  
    const nextPatient = waitingList.shift();
    attendingPatient = nextPatient;
    localStorage.removeItem("paciente_" + nextPatient.name);
    updateUI();
  });
  
  updateUI();
});

