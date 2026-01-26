// Mafia Game Logic - Private Role Reveal
// ========================================

// Game State
let players = [];
let roles = [];
let currentPlayerIndex = 0;
let gamePhase = 'setup'; // setup, revealing, admin

// Roles Definition
const ROLES = {
    don: {
        name: 'დონი',
        icon: '👑',
        color: 'don',
        description: 'მაფიის ლიდერი. ღამით კლავს მოქალაქეებს.'
    },
    mafia: {
        name: 'მაფიოზი',
        icon: '🔪',
        color: 'mafia',
        description: 'მაფიის წევრი. ღამით კლავს მოქალაქეებს.'
    },
    detective: {
        name: 'დეტექტივი',
        icon: '🕵️',
        color: 'detective',
        description: 'ღამით ამოწმებს ერთ მოთამაშეს და ხედავს მის როლს.'
    },
    doctor: {
        name: 'ექიმი',
        icon: '💊',
        color: 'doctor',
        description: 'ღამით იცავს ერთ მოთამაშეს გარდაცვალებისგან.'
    },
    maniac: {
        name: 'მანიაკი',
        icon: '🔪',
        color: 'maniac',
        description: 'ღამით კლავს ნებისმიერ მოთამაშეს (მათ შორის მაფიას).'
    },
    citizen: {
        name: 'მოქალაქე',
        icon: '👨‍👩‍👧‍👦',
        color: 'citizen',
        description: 'მშვიდობიანი მოქალაქე. დღისით ხმას აძლევს.'
    }
};

// ========================================
// Initialize Input Fields
// ========================================
function initInputs() {
    const container = document.getElementById('player-inputs');
    
    for (let i = 1; i <= 12; i++) {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>მოთამაშე ${i}</label>
            <input type="text" id="player${i}" placeholder="სახელი" value="მოთამაშე ${i}">
        `;
        container.appendChild(div);
    }
}

// ========================================
// Shuffle Array (Fisher-Yates)
// ========================================
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ========================================
// Assign Roles
// ========================================
function assignRoles() {
    const rolesList = [
        'don',
        'mafia', 'mafia',
        'detective',
        'doctor',
        'maniac',
        'citizen', 'citizen', 'citizen', 
        'citizen', 'citizen', 'citizen'
    ];
    return shuffle(rolesList);
}

// ========================================
// Start Game
// ========================================
function startGame() {
    // Get player names
    players = [];
    for (let i = 1; i <= 12; i++) {
        const input = document.getElementById(`player${i}`);
        const name = input.value.trim() || `მოთამაშე ${i}`;
        players.push(name);
    }
    
    // Assign roles
    roles = assignRoles();
    currentPlayerIndex = 0;
    gamePhase = 'revealing';
    
    // Hide setup, show reveal screen
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('reveal-screen').style.display = 'block';
    
    showNextPlayer();
}

// ========================================
// Show Next Player
// ========================================
function showNextPlayer() {
    if (currentPlayerIndex >= players.length) {
        // All revealed, show admin view
        showAdminView();
        return;
    }
    
    const playerName = players[currentPlayerIndex];
    const role = roles[currentPlayerIndex];
    const roleData = ROLES[role];
    
    const container = document.getElementById('reveal-container');
    container.innerHTML = `
        <div class="reveal-card">
            <div class="player-number">#${currentPlayerIndex + 1}</div>
            <h2 style="font-size: 2rem; color: #1e293b; margin: 1rem 0;">
                ${playerName}
            </h2>
            <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 2rem;">
                👇 დააჭირე ქვემოთ შენი როლის სანახავად
            </p>
            
            <div id="role-revealer" class="role-revealer" onclick="revealCurrentRole()">
                <div class="role-hidden-large">❓</div>
                <p style="font-size: 1rem; color: #64748b; margin-top: 1rem;">
                    აჩვენე როლი
                </p>
            </div>
            
            <div id="role-display" class="role-display" style="display: none;">
                <div class="role-icon-large ${roleData.color}">
                    ${roleData.icon}
                </div>
                <h3 class="role-name-large">${roleData.name}</h3>
                <p class="role-desc-large">${roleData.description}</p>
                
                <button class="next-player-btn" onclick="nextPlayer()">
                    შემდეგი მოთამაშე →
                </button>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; color: white;">
            მოთამაშე ${currentPlayerIndex + 1} / ${players.length}
        </div>
    `;
}

// ========================================
// Reveal Current Role
// ========================================
function revealCurrentRole() {
    document.getElementById('role-revealer').style.display = 'none';
    document.getElementById('role-display').style.display = 'block';
}

// ========================================
// Next Player
// ========================================
function nextPlayer() {
    currentPlayerIndex++;
    showNextPlayer();
}

// ========================================
// Show Admin View
// ========================================
function showAdminView() {
    gamePhase = 'admin';
    
    document.getElementById('reveal-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'block';
    
    const grid = document.getElementById('admin-grid');
    grid.innerHTML = '';
    
    players.forEach((name, index) => {
        const role = roles[index];
        const roleData = ROLES[role];
        
        const card = document.createElement('div');
        card.className = `admin-card ${roleData.color}`;
        card.innerHTML = `
            <div class="admin-number">#${index + 1}</div>
            <div class="admin-name">${name}</div>
            <div class="admin-icon">${roleData.icon}</div>
            <div class="admin-role">${roleData.name}</div>
        `;
        grid.appendChild(card);
    });
}

// ========================================
// Restart Game
// ========================================
function restartGame() {
    gamePhase = 'setup';
    currentPlayerIndex = 0;
    players = [];
    roles = [];
    
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('reveal-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'none';
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mafia Game Initialized');
    initInputs();
});
EOF
