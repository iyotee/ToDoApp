/*  On écoute les évènements sur la page, après que la page soit chargée complètement */
window.addEventListener("load", () => {
  /* On query les selecteurs du DOM qui seront utilisé */
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  let indexa = 0;

  /* On écoute les évènements submit sur le formulaire form */
  form.addEventListener("submit", (e) => {
    e.preventDefault(); /* Retrouver à quoi ça sert concrètement */

    /* On récupère la valeure de l'input du user */
    const taskValue = input.value;

    /* On test si il y a une valeure dans l'input. Si y'à pas de valeure, alors on affiche une alerte */
    if (!taskValue) {
      alert("Veuillez indiquer une tâche à faire");
      return;
    }

    const getStorage = (key) => {
      return JSON.parse(localStorage.getItem(key));
    };

    const setStorage = (key, value) => {
      const stringified_value = JSON.stringify(value);
      localStorage.setItem(key, stringified_value);
    };

    /* FACON ARRAY On ajoute la tâche au localStorage */
    /* var new_data = taskValue;

    if (localStorage.getItem("savedtask_1") == null) {
      localStorage.setItem("savedtask_1", "[]");
    }

    var old_data = getStorage("savedtask_1"); //JSON.parse(localStorage.getItem('savedtask'));
    old_data.push(new_data);

    setStorage("savedtask_1", old_data); */

    /* FACON KEY ENTIERE On ajoute la tâche au localStorage */

    var new_data = {
      index: indexa,
      task: taskValue,
      completed: false,
    };

    setStorage(indexa, new_data);

    /* Ici on va faire la partie dynamique, c'est à dire la partie de la div task */

    /* On créer un element div et on ajoute la classe .task */
    const task_root_el = document.createElement("div");
    task_root_el.classList.add("task");

    /* On créer un element div et on ajoute la classe .content */
    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");

    /* On créer un element input, on lui attribue un type texte, on lui ajoue la classe texte, puis le trick ici, on lui attribue la valeur 'task' qui est donc la valeure de l'input du user. Enfin, on lui met un attribue Read-Only, pour ne pas permettre de modifier la tâche */
    const task_input_el = document.createElement("input");
    task_input_el.type = "text";
    task_input_el.classList.add("text");
    const task = getStorage(indexa);
    task_input_el.value = task["task"];

    task_input_el.setAttribute("readonly", "readonly");

    /* On créer un element div et on ajoute la classe .actions */
    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");

    /*  On créer un element button et on lui ajoute la classe edit ainsi qu'un innerHTML pour le nommer "Editer" */
    const task_edit_el = document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerHTML = "Editer";

    /*  On créer un element button et on lui ajoute la classe delete ainsi qu'un innerHTML pour le nommer "Supprimer" */
    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerHTML = "Supprimer";

    /* Ici on structure l'architecture du DOM parents-enfants comme ci-dessous ( voir index.html:29 ) */

    /*
        |_ tasks
            |_ task
                |_ content
                    |_ input
                |_ actions
                    |_EditButton
                    |_DeleteButton 
        */
    /* Pour mieux comprendre j'ai illustrer avec le vrai nom des variables la même chose qu'au dessus */
    /*
        |_ list_el
            |_ task_root_el
                |_ task_content_el
                    |_ task_input_el
                |_ task_actions_el
                    |_task_edit_el
                    |_task_delete_el
        */

    /* On appendChild la tâche (task) dans les tâches (list_el)*/
    list_el.appendChild(task_root_el);

    /* On appendChild le contenu (content) dans la tâche (task_root_el) */
    task_root_el.appendChild(task_content_el);

    /* On appendChild l'input du user (input) dans le contenu (content) */
    task_content_el.appendChild(task_input_el);

    /* On apprenChild les actions (actions) dans la tâche (task) */
    task_root_el.appendChild(task_actions_el);

    /* On appendChild le bouton Editer (EditButton) dans les actions (actions) */
    task_actions_el.appendChild(task_edit_el);

    /* On appendChild le bouton Supprimer (DeleteButton) dans les actions (actions) */
    task_actions_el.appendChild(task_delete_el);

    /* On remet à la valeure de l'input du user à null */
    input.value = "";

    /* On écoute les évènements de click sur l'input de la tâche (task_input_el) et SI la classe de l'input user est text ( donc normal ) ALORS on ajoute la classe checked pour dire que la tâche est faite */
    task_content_el.addEventListener("click", () => {
      if (
        task_input_el.classList == "text" &&
        task_edit_el.innerHTML.toLowerCase() == "editer"
      ) {
        task_input_el.classList.add("checked");
      } else {
        task_input_el.classList.remove("checked");
      }
    });

    /* On écoute les évènements de click sur le bouton edit (task_edit_el) */
    task_edit_el.addEventListener("click", () => {
      /* SI le InnerHTML du bouton Edit est "Edit", ALORS -> 
            - On retire l'attribut de readOnly de l'input (task_input_el) pour permettre au user de modifier sa tâche
            - On focus sur l'input user ( permet au curseur de passer en mode edition sur l'input sans qu'on ai besoin d'aller cliquer dessus)
            - On modifie la valeure du bouton Edit (le InnerHTML puisque c'est un bouton) pour devenir "Sauver"
            SINON (donc ça veut dire que c'est marqué Sauver) -> 
            - On remet l'attribut de readOnly de l'input (task_input_el) pour de nouveau ne plus permettre de modifier
            - On remet l'innerHTML du bouton Edit en "Edit" */

      if (task_edit_el.innerHTML.toLowerCase() == "editer") {
        task_input_el.removeAttribute("readonly");
        task_input_el.focus();
        task_edit_el.innerHTML = "Sauver";
      } else {
        task_input_el.setAttribute("readonly", "readonly");
        task_edit_el.innerHTML = "Editer";
      }
    });

    /* On écoute les évènements sur le bouton delete */
    task_delete_el.addEventListener("click", () => {
      /* On delete l'enfant task (task_root_el) du parent tasks (list_el) */

      list_el.removeChild(task_root_el);
      indexa -= 1;
      localStorage.removeItem(localStorage.key(0));
    });

    indexa += 1;
  });
});
