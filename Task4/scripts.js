/* scripts.js - handles UI & logic for all pages (ToDo localStorage + Product filter/sort) */
(function () {
  // common: fill years
  document.getElementById('year')?.textContent = new Date().getFullYear();
  document.getElementById('year-2')?.textContent = new Date().getFullYear();
  document.getElementById('year-3')?.textContent = new Date().getFullYear();

  const page = document.body.id;

  // ---------------------------
  // To-Do App (projects.html)
  // ---------------------------
  if (page === 'page-projects') {
    /* ---------- TODO APP ---------- */
    const TODO_KEY = 'mr_todo_v1';
    let todos = JSON.parse(localStorage.getItem(TODO_KEY) || '[]');

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoCount = document.getElementById('todo-count');
    const filterAll = document.getElementById('filter-all');
    const filterActive = document.getElementById('filter-active');
    const filterCompleted = document.getElementById('filter-completed');
    const clearCompleted = document.getElementById('clear-completed');

    let todoFilter = 'all';

    function saveTodos() {
      localStorage.setItem(TODO_KEY, JSON.stringify(todos));
    }

    function renderTodos() {
      todoList.innerHTML = '';
      const filtered = todos.filter(t => {
        if (todoFilter === 'active') return !t.done;
        if (todoFilter === 'completed') return t.done;
        return true;
      });
      filtered.forEach(item => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (item.done ? ' completed' : '');
        li.innerHTML = `
          <input type="checkbox" class="todo-check" ${item.done ? 'checked' : ''} aria-label="Mark ${escapeHtml(item.text)} done" />
          <span class="text">${escapeHtml(item.text)}</span>
          <div style="margin-left:auto;display:flex;gap:8px">
            <button class="small-btn edit">Edit</button>
            <button class="small-btn delete">Delete</button>
          </div>
        `;
        // checkbox
        li.querySelector('.todo-check').addEventListener('change', (e) => {
          item.done = e.target.checked;
          saveTodos();
          renderTodos();
        });
        // edit
        li.querySelector('.edit').addEventListener('click', () => {
          const newText = prompt('Edit task', item.text);
          if (newText !== null) {
            item.text = newText.trim();
            saveTodos();
            renderTodos();
          }
        });
        // delete
        li.querySelector('.delete').addEventListener('click', () => {
          todos = todos.filter(t => t !== item);
          saveTodos();
          renderTodos();
        });

        todoList.appendChild(li);
      });
      const remaining = todos.filter(t => !t.done).length;
      todoCount.textContent = `${remaining} remaining • ${todos.length} total`;
    }

    todoForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;
      todos.unshift({ text, done: false, id: Date.now() });
      todoInput.value = '';
      saveTodos();
      renderTodos();
    });

    filterAll?.addEventListener('click', () => setFilter('all'));
    filterActive?.addEventListener('click', () => setFilter('active'));
    filterCompleted?.addEventListener('click', () => setFilter('completed'));
    clearCompleted?.addEventListener('click', () => {
      todos = todos.filter(t => !t.done);
      saveTodos();
      renderTodos();
    });

    function setFilter(f) {
      todoFilter = f;
      [filterAll, filterActive, filterCompleted].forEach(btn => btn.classList.remove('active'));
      if (f === 'all') filterAll.classList.add('active');
      if (f === 'active') filterActive.classList.add('active');
      if (f === 'completed') filterCompleted.classList.add('active');
      renderTodos();
    }

    // initialize
    setFilter('all');

    /* ---------- PRODUCT LISTING ---------- */
    const products = [
      { id: 1, title: 'Smartphone Alpha', category: 'electronics', price: 19999, rating: 4.5 },
      { id: 2, title: 'Wireless Headset', category: 'electronics', price: 2999, rating: 4.1 },
      { id: 3, title: 'Running Shoes', category: 'fashion', price: 2499, rating: 4.3 },
      { id: 4, title: 'Backpack Pro', category: 'fashion', price: 1499, rating: 4.0 },
      { id: 5, title: 'Coffee Maker', category: 'home', price: 3999, rating: 4.6 },
      { id: 6, title: 'Desk Lamp', category: 'home', price: 799, rating: 3.9 }
    ];

    const productGrid = document.getElementById('product-grid');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const maxPrice = document.getElementById('max-price');

    function populateCategories() {
      const cats = Array.from(new Set(products.map(p => p.category)));
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = capitalize(c);
        categoryFilter.appendChild(opt);
      });
    }

    function renderProducts() {
      productGrid.innerHTML = '';
      const cat = categoryFilter.value;
      const maxP = parseFloat(maxPrice.value) || Infinity;
      let list = products.slice();

      if (cat !== 'all') list = list.filter(p => p.category === cat);
      list = list.filter(p => p.price <= maxP);

      const sortVal = sortBy.value;
      if (sortVal === 'rating-desc') list.sort((a,b)=>b.rating - a.rating);
      if (sortVal === 'price-asc') list.sort((a,b)=>a.price - b.price);
      if (sortVal === 'price-desc') list.sort((a,b)=>b.price - a.price);

      if (list.length === 0) {
        productGrid.innerHTML = '<div class="muted">No products match the selection.</div>';
        return;
      }

      list.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
          <h4>${escapeHtml(p.title)}</h4>
          <div class="muted small">${capitalize(p.category)} • Rating: ${p.rating.toFixed(1)}</div>
          <div class="product-price">₹ ${p.price.toLocaleString('en-IN')}</div>
          <button class="btn buy">View / Buy</button>
        `;
        productGrid.appendChild(div);
      });
    }

    categoryFilter?.addEventListener('change', renderProducts);
    sortBy?.addEventListener('change', renderProducts);
    maxPrice?.addEventListener('input', renderProducts);

    populateCategories();
    renderProducts();
  }

  // ---------------------------
  // Contact form behavior (contact.html)
  // ---------------------------
  if (page === 'page-contact') {
    const contactForm = document.getElementById('contact-form');
    const contactResult = document.getElementById('contact-result');
    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      // demo: store contact message in sessionStorage (no backend)
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-message').value.trim();
      const store = JSON.parse(sessionStorage.getItem('contacts_demo') || '[]');
      store.push({ name, email, msg, at: new Date().toISOString() });
      sessionStorage.setItem('contacts_demo', JSON.stringify(store));
      contactResult.textContent = 'Message stored locally (demo). Thank you, ' + name + '!';
      contactForm.reset();
    });
  }

  // small helpers
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1) }
})();
