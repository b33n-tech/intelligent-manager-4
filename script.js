// --- Récupérer les éléments ---
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const archiveBtn = document.getElementById("archiveBtn");
const tasksContainer = document.getElementById("tasksContainer");

// --- Charger les tâches depuis localStorage ---
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

// --- Initial render ---
renderTasks();
