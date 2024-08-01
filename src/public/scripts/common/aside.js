document.querySelectorAll('aside li a').forEach(link => {
    link.addEventListener('click', function() {
      if (this.id !== 'abrir__tarjetaDatos' && this.id !== 'abrir__registroDoctor') {
        document.querySelectorAll('aside li a').forEach(link => link.classList.remove('seleccionado'));
        this.classList.add('seleccionado');
      }
    });
  });
  