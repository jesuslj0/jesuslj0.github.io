document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("textInput");
    const list = document.getElementById("list");

    function filterList() {
        const filter = searchInput.value.toLowerCase();
        const items = list.getElementsByTagName("li");

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const text = item.textContent || item.innerText;

            if (text.toLowerCase().indexOf(filter) > -1) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        }
    }
    searchInput.addEventListener("keyup", filterList);
});