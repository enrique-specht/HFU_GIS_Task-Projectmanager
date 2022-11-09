//Close popup when clicked elsewhere
document.addEventListener("click", function(event){
    let popup_create = document.getElementById("popup-create");
    let button_create = document.getElementById("create-new");
    if (popup_create != null && button_create != null) {
        if (!popup_create.contains(event.target) && !button_create.contains(event.target)) {
            popup_create.remove();    
        }    
    }
    let popup_edit = document.getElementById("popup-edit");
    let button_edit = document.querySelector("[edit]");
    if (popup_edit != null && button_edit != null) {
        if (!popup_edit.contains(event.target) && !button_edit.contains(event.target)) {
            popup_edit.remove();
            button_edit.removeAttribute("edit");
        }
    }
});