
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const menuItems = document.querySelectorAll('.menu-item');
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    
    // Criar overlay para o menu mobile
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Função para verificar se é dispositivo móvel
    const isMobile = () => window.innerWidth <= 768;
    
    // Função para alternar o menu mobile
    function toggleMobileMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Bloquear rolagem do body quando o menu estiver aberto
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
        
        // Fechar todos os submenus quando o menu é fechado
        if (isExpanded) {
            closeAllSubmenus();
        }
    }
    
    // Função para fechar todos os submenus
    function closeAllSubmenus() {
        hasSubmenuItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Função para fechar o menu mobile
    function closeMobileMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        closeAllSubmenus();
    }
    
    // Função para alternar submenu
    function toggleSubmenu(item, event) {
        // Em dispositivos móveis, impedir que o link seja seguido
        if (isMobile()) {
            event.preventDefault();
            
            // Fechar outros submenus abertos
            hasSubmenuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar o submenu atual
            item.classList.toggle('active');
        }
    }
    
    // Função para marcar item como ativo
    function setActiveItem(item) {
        // Remover classe ativa de todos os itens
        menuItems.forEach(menuItem => {
            menuItem.classList.remove('active');
        });
        
        // Adicionar classe ativa ao item clicado
        item.classList.add('active');
    }
    

    
    // Alternar menu mobile ao clicar no botão hambúrguer
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Fechar menu mobile ao clicar no overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Gerenciar cliques nos itens do menu
    menuItems.forEach(item => {
        const link = item.querySelector('.menu-link');
        
        // Gerenciar submenus
        if (item.classList.contains('has-submenu')) {
            link.addEventListener('click', (e) => {
                toggleSubmenu(item, e);
            });
        } else {
            // Para itens sem submenu, apenas marcar como ativo
            link.addEventListener('click', (e) => {
                setActiveItem(item);
                
                // Fechar menu mobile ao clicar em um item sem submenu
                if (isMobile()) {
                    closeMobileMenu();
                }
            });
        }
    });
    
    // Gerenciar cliques nos itens de submenu
    document.querySelectorAll('.submenu-link').forEach(link => {
        link.addEventListener('click', () => {
            if (isMobile()) {
                closeMobileMenu();
            }
        });
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (!isMobile() && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Suporte a navegação por teclado
    document.addEventListener('keydown', (e) => {
        // Fechar menu ao pressionar ESC
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Adicionar atributos ARIA para acessibilidade
    hasSubmenuItems.forEach(item => {
        const link = item.querySelector('.menu-link');
        const submenu = item.querySelector('.submenu');
        const submenuId = `submenu-${Math.random().toString(36).substr(2, 9)}`;
        
        submenu.id = submenuId;
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
        link.setAttribute('aria-controls', submenuId);
        
        // Atualizar atributos ARIA ao abrir/fechar submenu
        item.addEventListener('mouseenter', () => {
            if (!isMobile()) {
                link.setAttribute('aria-expanded', 'true');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!isMobile()) {
                link.setAttribute('aria-expanded', 'false');
            }
        });
        
        link.addEventListener('click', () => {
            if (isMobile()) {
                const isExpanded = link.getAttribute('aria-expanded') === 'true';
                link.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });
});
