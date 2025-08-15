// Form Validation
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let formMessage = document.getElementById("formMessage");

    // Email format check
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (name === "" || email === "" || message === "") {
        formMessage.style.color = "red";
        formMessage.textContent = "Please fill in all fields.";
    } else if (!email.match(emailPattern)) {
        formMessage.style.color = "red";
        formMessage.textContent = "Please enter a valid email.";
    } else {
        formMessage.style.color = "green";
        formMessage.textContent = "Form submitted successfully!";
        this.reset();
    }
});

// Dynamic To-Do List
function addTask() {
    let input = document.getElementById("todoInput");
    let task = input.value.trim();
    if (task === "") return;

    let li = document.createElement("li");
    li.textContent = task;

    let deleteBtn = document.createElement("span");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete");
    deleteBtn.onclick = function() {
        this.parentElement.remove();
    };

    li.appendChild(deleteBtn);
    document.getElementById("todoList").appendChild(li);

    input.value = "";
}
