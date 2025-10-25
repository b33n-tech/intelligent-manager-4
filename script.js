// --- Elements ---
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const archiveBtn = document.getElementById("archiveBtn");
const tasksContainer = document.getElementById("tasksContainer");
const promptsContainer = document.getElementById("promptsContainer");
const copiedMsg = document.getElementById("copiedMsg");

// --- Tâches stockées localement ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// --- Fonction pour afficher les tâches ---
function renderTasks() {
  tasksContainer.innerHTML = "";
  tasks.slice().reverse().forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text + " (ajoutée le " + task.date.split("T")[0] + ")";
    tasksContainer.appendChild(li);
  });
}

// --- Ajouter une tâche ---
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text: text, date: new Date().toISOString() });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    renderTasks();
  } else {
    alert("Merci d’entrer une tâche !");
  }
});

// --- Archiver (télécharger JSON) ---
archiveBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("Aucune tâche à archiver !");
    return;
  }
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taches_${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// --- Charger les prompts depuis prompts.json ---
fetch("prompts.json")
  .then(response => response.json())
  .then(prompts => {
    prompts.forEach(p => {
      const btn = document.createElement("button");
      btn.textContent = p.label;
      btn.addEventListener("click", () => {
        const combined = p.text + "\n\n" + tasks.map(t => "- " + t.text).join("\n");
        navigator.clipboard.writeText(combined)
          .then(() => {
            copiedMsg.style.display = "block";
            setTimeout(() => copiedMsg.style.display = "none", 2000);
          });
      });
      promptsContainer.appendChild(btn);
    });
  });

// --- Initial render ---
renderTasks();
