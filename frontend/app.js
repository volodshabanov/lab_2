// Ключ для збереження в LocalStorage
const STORAGE_KEY = "lr1_passes_v8_custom";
// Стан застосунку (масив записів) та змінна для режиму редагування
let passes = loadFromStorage();
let editingId = null;

// DOM Елементи форми (знаходимо їх після завантаження сторінки завдяки defer) [cite: 728-744]
const form = document.getElementById("createForm");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");
const tbody = document.getElementById("passesTableBody");

// DOM Елементи фільтрів
const searchInput = document.getElementById("searchInput");
const filterReasonSelect = document.getElementById("filterReasonSelect");

// Відмальовуємо таблицю при запуску
renderTable();

// 1. Обробка події submit (Додавання або збереження після редагування) [cite: 908-916]
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Забороняємо перезавантаження сторінки [cite: 904]

    const dto = readForm();
    const isValid = validate(dto);

    if (!isValid) return; // Зупиняємося, якщо є помилки

    if (editingId !== null) {
        updatePass(editingId, dto);
        editingId = null;
        submitBtn.textContent = "Додати запис";
    } else {
        addPass(dto);
    }

    saveToStorage(passes); // Зберігаємо після кожної зміни [cite: 1227-1228]
    renderTable();
    form.reset();
    clearAllErrors();
});

// 2. Обробка кнопки "Очистити" [cite: 945-948]
resetBtn.addEventListener("click", () => {
    form.reset();
    clearAllErrors();
    editingId = null;
    submitBtn.textContent = "Додати запис";
});

// 3. Делегування подій для динамічних кнопок таблиці (Редагувати/Видалити) 
tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.dataset.id) return;

    const id = Number(target.dataset.id);

    if (target.classList.contains("delete-btn")) {
        deletePassById(id);
        saveToStorage(passes);
        renderTable();
    }

    if (target.classList.contains("edit-btn")) {
        startEdit(id);
    }
});

// 4. Динамічне оновлення таблиці при пошуку та фільтрації
searchInput.addEventListener("input", renderTable);
filterReasonSelect.addEventListener("change", renderTable);

// ================= ФУНКЦІЇ ЛОГІКИ =================

// Зчитування полів у DTO [cite: 1117-1123]
function readForm() {
    return {
        userPHD: document.getElementById("UserPHD").value,
        userName: document.getElementById("userNameInput").value,
        reason: document.getElementById("reasonSelect").value,
        validDate: document.getElementById("DateId").value, // Твій кастомний ID
        issuer: document.getElementById("issuerInput").value,
        comment: document.getElementById("commentInput").value
    };
}

// Перевірка введених даних (Валідація) [cite: 1128-1153]
function validate(dto) {
    clearAllErrors();
    let isValid = true;

    if (dto.userPHD === "") {
        showError("UserPHD", "UserPHDError", "Будь ласка, оберіть освітню програму.");
        isValid = false;
    }

    const user = dto.userName.trim();
    if (user === "") {
        showError("userNameInput", "userNameError", "Ім'я користувача є обов'язковим.");
        isValid = false;
    } else if (user.length < 4 || user.length > 35) {
        showError("userNameInput", "userNameError", "Довжина має бути від 4 до 35 символів.");
        isValid = false;
    }

    if (dto.reason === "") {
        showError("reasonSelect", "reasonError", "Оберіть причину пропуску.");
        isValid = false;
    }

    if (dto.validDate === "") {
        showError("DateId", "DateError", "Вкажіть дату.");
        isValid = false;
    }

    const issuer = dto.issuer.trim();
    if (issuer === "") {
        showError("issuerInput", "issuerError", "Поле 'Ким видано' є обов'язковим.");
        isValid = false;
    }

    return isValid;
}

function addPass(dto) {
    const nextId = passes.length === 0 ? 1 : Math.max(...passes.map(p => p.id)) + 1;
    passes.push({ id: nextId, ...dto, userName: dto.userName.trim(), issuer: dto.issuer.trim(), comment: dto.comment.trim() });
}

function updatePass(id, dto) {
    const index = passes.findIndex(p => p.id === id); // Суворе порівняння === [cite: 665-671]
    if (index !== -1) {
        passes[index] = { id: id, ...dto, userName: dto.userName.trim(), issuer: dto.issuer.trim(), comment: dto.comment.trim() };
    }
}

function deletePassById(id) {
    passes = passes.filter(p => p.id !== id);
}

function startEdit(id) {
    const pass = passes.find(p => p.id === id);
    if (!pass) return;

    document.getElementById("UserPHD").value = pass.userPHD;
    document.getElementById("userNameInput").value = pass.userName;
    document.getElementById("reasonSelect").value = pass.reason;
    document.getElementById("DateId").value = pass.validDate;
    document.getElementById("issuerInput").value = pass.issuer;
    document.getElementById("commentInput").value = pass.comment;

    editingId = id;
    submitBtn.textContent = "Зберегти зміни";
    document.getElementById("userNameInput").focus();
    clearAllErrors();
}

// ================= ФУНКЦІЇ UI =================

function renderTable() {
    let filteredPasses = passes;
    const searchQuery = searchInput.value.toLowerCase().trim();
    const filterReason = filterReasonSelect.value;

    if (searchQuery !== "") {
        filteredPasses = filteredPasses.filter(p => p.userName.toLowerCase().includes(searchQuery));
    }

    if (filterReason !== "") {
        filteredPasses = filteredPasses.filter(p => p.reason === filterReason);
    }

    if (filteredPasses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Записів не знайдено.</td></tr>`;
        return;
    }

    // Словник для красивого відображення причин
    const reasonLabels = {
        "LabWork": "Лабораторна",
        "PractWork": "Практична",
        "Exam": "Екзамен",
        "ModuleWork": "Модульна",
        "Research": "Наукова"
    };

    const rowsHtml = filteredPasses.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.userName} <br><small>(${item.userPHD === 'Baclvr' ? 'Бакалавр' : 'Магістр'})</small></td>
            <td>${reasonLabels[item.reason] || item.reason}</td>
            <td>${item.validDate}</td>
            <td>${item.issuer}</td>
            <td>
                <button type="button" class="edit-btn" data-id="${item.id}">Редагувати</button>
                <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
            </td>
        </tr>
    `).join(""); // Використання template literals для формування HTML [cite: 696-699]

    tbody.innerHTML = rowsHtml;
}

// Відображення помилки [cite: 1063-1065]
function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerHTML = message;
}

// Очищення всіх помилок. Використовуємо об'єкт для співставлення твоїх кастомних ID
function clearAllErrors() {
    const errorMap = {
        "UserPHD": "UserPHDError",
        "userNameInput": "userNameError",
        "reasonSelect": "reasonError",
        "DateId": "DateError",
        "issuerInput": "issuerError",
        "commentInput": "commentError"
    };

    for (const [inputId, errorId] of Object.entries(errorMap)) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.remove("invalid");
        if (error) error.innerHTML = "";
    }
}

// ================= ФУНКЦІЇ ЗБЕРЕЖЕННЯ =================

function saveToStorage(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromStorage() {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}