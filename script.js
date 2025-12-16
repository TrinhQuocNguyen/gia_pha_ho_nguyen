

// --- Pan and Zoom State ---
let scale = 1;
let panning = false;
let startPoint = { x: 0, y: 0 };
let transform = { x: 0, y: 0 };
let treeElement = null;

// Utility function to get initials from name (fallback if no image)
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

// Create person card element
function createPersonCard(person, isSingle = false) {
    const card = document.createElement('div');
    card.className = `person-card ${isSingle ? 'single' : ''}`;
    
    // Determine gender class
    let genderClass = '';
    if (person.gender === 'male') {
        genderClass = 'avatar-male';
    } else if (person.gender === 'female') {
        genderClass = 'avatar-female';
    }

    // Create avatar with image or initials fallback
    let avatarHTML = '';
    if (person.image) {
        avatarHTML = `<img src="${person.image}" alt="${person.name}" class="${genderClass} person-photo " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
        avatarHTML += `<div class="person-avatar person-avatar-fallback" style="display: none;">${getInitials(person.name)}</div>`;
    } else {
        avatarHTML = `<div class="person-avatar">${getInitials(person.name)}</div>`;
    }

    // Display name and birth year directly
    card.innerHTML = `
        ${avatarHTML}
        <div class="person-name ${genderClass}">${person.name}</div>
        ${person.birthYear ? `<div class="person-birth">b. ${person.birthYear}</div>` : ''}
    `;

    return card;
}

// Create couple display
function createCoupleDisplay(person1, person2) {
    const coupleContainer = document.createElement('div');
    coupleContainer.className = 'couple-container';
    
    const person1Card = createPersonCard(person1);
    const person2Card = createPersonCard(person2);
    const connector = document.createElement('div');
    connector.className = 'couple-connector';
    
    coupleContainer.appendChild(person1Card);
    coupleContainer.appendChild(connector);
    coupleContainer.appendChild(person2Card);
    
    return coupleContainer;
}

// Create expand/collapse button
function createExpandButton(hasChildren) {
    if (!hasChildren) return null;
    
    const button = document.createElement('button');
    button.className = 'expand-button';
    button.innerHTML = `<span class="arrow">►</span>`;
    
    return button;
}

// Create children section
function createChildrenSection(children, level = 0) {
    if (!children || children.length === 0) return null;
    
    // Create children container - initially collapsed
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'children-container collapsible';
    
    // Render children
    children.forEach(child => {
        const childElement = renderFamilyMember(child, level + 1);
        childrenContainer.appendChild(childElement);
    });
    
    return childrenContainer;
}

// Render individual family member
function renderFamilyMember(person, level = 0) {
    const memberContainer = document.createElement('div');
    memberContainer.className = 'family-member';

    const nodeContent = document.createElement('div');
    nodeContent.className = 'node-content';
    
    if (person.spouse) {
        // Create couple display
        const coupleDisplay = createCoupleDisplay(person, { name: person.spouse });
        nodeContent.appendChild(coupleDisplay);
    } else {
        // Create single person display
        const personCard = createPersonCard(person, true);
        nodeContent.appendChild(personCard);
    }
    
    memberContainer.appendChild(nodeContent);
    
    // Add children section if they exist
    if (person.children && person.children.length > 0) {
        const expandButton = createExpandButton(true);
        nodeContent.appendChild(expandButton);

        const childrenContainer = createChildrenSection(person.children, level);
        memberContainer.appendChild(childrenContainer);

        // Add expand/collapse functionality
        expandButton.addEventListener('click', () => {
            childrenContainer.classList.toggle('expanded');
            expandButton.classList.toggle('expanded');
        });
    } else {
        // It's a leaf node, add a class for alignment
        nodeContent.classList.add('leaf-node');
    }
    
    return memberContainer;
}

// Build the complete tree structure
function buildFamilyTree() {
    const treeRoot = document.createElement('div');
    treeRoot.className = 'tree-root';
    
    // Only render the root person initially
    const rootElement = renderFamilyMember(familyData, 0);
    treeRoot.appendChild(rootElement);
    
    return treeRoot;
}

// Initialize the family tree
function initializeFamilyTree() {
    const container = document.getElementById('family-tree-container');
    if (!container) return;

    container.innerHTML = '';
    
    treeElement = buildFamilyTree();
    container.appendChild(treeElement);

    const zoomSlider = document.getElementById('zoom-slider');

    // --- Pan and Zoom Logic ---
    treeElement.style.transformOrigin = 'top left';

    const applyTransform = () => {
        if (treeElement) {
            treeElement.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${scale})`;
            if (zoomSlider) zoomSlider.value = scale;
        }
    };

    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        panning = true;
        startPoint = { x: e.clientX - transform.x, y: e.clientY - transform.y };
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mousemove', (e) => {
        if (!panning) return;
        e.preventDefault();
        transform.x = e.clientX - startPoint.x;
        transform.y = e.clientY - startPoint.y;
        applyTransform();
    });

    const stopPanning = () => {
        panning = false;
        container.style.cursor = 'grab';
    };

    container.addEventListener('mouseup', stopPanning);
    container.addEventListener('mouseleave', stopPanning);

    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            const newScale = parseFloat(e.target.value);
            const oldScale = scale;
            scale = newScale;

            const rect = container.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Adjust translation to zoom towards the center of the viewport
            transform.x = centerX - (centerX - transform.x) * (scale / oldScale);
            transform.y = centerY - (centerY - transform.y) * (scale / oldScale);

            applyTransform();
        });
    }
}

// Add a new family member (example function)
function addFamilyMember(parentName, newMember) {
    // This function can be used to dynamically add new family members
    // Implementation would depend on your specific needs
    console.log(`Adding ${newMember.name} to ${parentName}`);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeFamilyTree);
