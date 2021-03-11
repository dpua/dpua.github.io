(function($){
  $(function(){

    $('.sidenav').sidenav();
    initMaterializeComponents();
    // setTimeout(activarClaseActivaInputs,2000);
  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function() {
  $('.menu-desconectar').on('click', function() {
    localStorage.clear();
    window.location.href = 'salir.php';
  });


function initMaterializeComponents() {
  $(".dropdown-trigger").dropdown();
  const textFields = document.querySelectorAll('.mdc-text-field');
  const selectFields = document.querySelectorAll('.mdc-select');

  for (const textField of textFields) {
    if ($(textField).find('input').length > 0 || $(textField).find('textarea').length > 0) {
      try {
        mdc.textField.MDCTextField.attachTo(textField);
      } catch (e) {
        console.log(e)
      }
    }
  }

  for (const selectField of selectFields) {
    try {
      mdc.select.MDCSelect.attachTo(selectField);

      // apaño para solucionar que la label flotante mientras no tiene el foco no tiene width
      $(selectField).find('.mdc-notched-outline__notch').width('auto');
      // setTimeout(function() {
      //   var labelWidth = $(selectField).find('.mdc-notched-outline__notch .mdc-floating-label').width();
      //   $(selectField).find('.mdc-notched-outline__notch').width(labelWidth);
      // }, 100);
    } catch (e) {
      console.log(e)
    }
  }

  activarClaseActivaInputs();
}


function idiomaEsp(idioma) {
  return (navigator.language == 'es' || navigator.language == 'ca' || navigator.language == 'es-419' || navigator.language == 'es-ES')
}

function HayEspacios(pasw){
  var cont=0;
  while (cont<pasw.length){
      if (pasw.charAt(cont) === ' '){
          return true;
      }
      cont++;
      }
  return false;
}

function muestraMensajeModal(texto, textoIng) {
if (textoIng) {
  if (idiomaEsp(navigator.language)) {
    $('.mensaje-modal').text(texto).fadeOut(500).fadeIn(500);
  } else {
    $('.mensaje-modal').text(textoIng).fadeOut(500).fadeIn(500);
  }
} else {
  $('.mensaje-modal').text(texto).fadeOut(500).fadeIn(500);
}
};

function activarClaseActivaInputs() {
  $('input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea').each(function (element, i) {
    if ($(this).val()) {
      $(this).parent().find('.mdc-notched-outline').addClass('mdc-notched-outline--notched');
      $(this).parent().find('label').addClass('mdc-floating-label--float-above');
    }
    // else {
    //     $(this).siblings('label').removeClass('active');
    // }
  });
};