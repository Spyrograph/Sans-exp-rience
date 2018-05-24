var app = {

  interval: null,
  finish:'',
  hero: '',
  $bodyPart: null,
  str: null,

  line: 0, // Servira à sélectionner chaque caractère d'une ligne de dialogue pour la machine écrire
  numberBody: 0, // Servira à attribuer une classe au différente partie du corps
  numberDialogue: 0, //Servira à sélectionner chaque ligne de dialogue afin de les faire défiler automatique

  init: function() {

    // lancement de la machine à écrire
    app.machine(app.numberDialogue);

    $("#talk")[0].currentTime = 3;

    // méthode pour assembler chaque partie du corps du héro qui seront animé plus tard
    app.assemblyHero(hero.head);
  },

///////////////////////////////////// Création de personnage et animation du visage ////////////////////////////////


  // Ici chaque partie du corps est créé.
  //Le "head" permettra de sélection différente tête selon l'expression du visage qu'on veut donner au personnage.
  assemblyHero: function(head) {
    // on remet à 0 la variable qui définit le numéro de la classe relatif à la partie du corps.
    app.numberBody = 0;
    app.creatHero(head); // ici une tête tout ce qu'il y a de plus bannale
    app.creatHero(hero.body);
    app.creatHero(hero.leg);

  },

  // Petite factorisation qui sera utilisé plusieurs pour changer l'expresison du visage
  heroFace: function (heroFace) {
    // on vide la div contenant les pixels qui dessinent le héro
    $(".bodyPart1").remove();
    $(".bodyPart2").remove();
    $(".bodyPart3").remove();
    // On reconstruit le héro en sélectionnant l'expression du visage qu'on veut lui donner
    app.assemblyHero(heroFace);
  },

  creatHero(bodyPart){
    var heroline;
    var heroletter;
    app.numberBody++;

    app.hero = bodyPart;
    //On créé la div contenant la partie du corps
    app.$bodyPart = $('<div>');
    //on lui ajouter sa classe
    app.$bodyPart.addClass('bodyPart'+app.numberBody);
    //on l'intègre à la div hero


    // on récupère chaque ligne du tableau Hero.Model
    for (var i in app.hero) {
      heroline = app.hero[i];

      //On récupère chaque caractère de chaque ligne
      for (var u in heroline) {
        heroletter = heroline[u];

        // on lance la méthode qui transformera chaque caractère en "pixel"
        app.createSquare(heroletter);
      }
    }
  },

  createSquare: function(heroletter){
    var pixelArt = '';

    switch(heroletter) {
      case "x": pixelArt = 'square-black'; break;
      case "o": pixelArt = 'square-lightgrey'; break;
      case "u": pixelArt = 'square-grey'; break;
      case "a": pixelArt = 'square-blue'; break;
      case "p": pixelArt = 'square-white'; break;
      case "t": pixelArt = 'square-teal'; break;
    }

    // on définit la div de chaque pixel
    var $div = $('<div>');
    // on ajoute la class 'square' à la div
    $div.addClass('square');
    // on définit la couleur de la div
    $div.addClass(pixelArt);

    // on range les pixel dans la partie du corps
    app.$bodyPart.append($div);

    // app.numberBody 3 renvoi les jambes du personnages.
    if ( app.numberBody === 3) {
      // les jambes soit la class bodyPart3 ira dans la div hero
      $("#hero").append(app.$bodyPart);
    }
    else {
      // la tête et le buste respectivement bodyPart1 et 2 iront dans la div head-body
      // qui sera l'élément frère de la div hero.
      // On sépare ainsi les éléments car la tête et le buste seront animés indépendamment des jambes
      $("#head-body").append(app.$bodyPart);
    }

  },
///////////////////////////////////////  Animation pure  ///////////////////////////////////////////

  // fonction permettant d'animer le buste du personnage (voir class css) me mouvement est en " /\ "
  mooveBody: function() {
    // La partie du corps monte " / "
    $('#head-body').addClass('up');
    setTimeout(function() {
      // La partie du corps descend " \ "
      $('#head-body').removeClass('up',).addClass('down');
      setTimeout(function() {
        // elle remonte dans l'autre sens " \ "
        $('#head-body').removeClass('down').addClass('up');
      }, 400);
        setTimeout(function() {
          // elle revient a sa position initiale  " / "
          $('#head-body').removeClass('up');
        }, 800);
          setTimeout(function() {
            // la méthode s'appelle elle-même afin de tourner en boucle
            requestAnimationFrame(app.mooveBody);
          }, 1200);
    }, 400);

  },
  // fonction permettant d'animer la tête du personnage (voir class css)
  mooveHead: function() {

    // La tête monte
    $('.bodyPart1').addClass('headUp');

    setTimeout(function() {
      // La tête descend
      $('.bodyPart1').removeClass('headUp');

      setTimeout(function() {
        requestAnimationFrame(app.mooveHead);
      },400);

    }, 400);

  },

///////////////////////////////////////  Gestion des dialogues  ///////////////////////////////////////////

  dialogueSelector: function() {

    // On incrémante de 1 pour sélectionner le dialoguqe suivant
    app.numberDialogue++;

    // arriver à la ligne 23 de dialogue le tout s'arrête
    if (app.numberDialogue < 24) {
      setTimeout(function() {
        app.machine(app.numberDialogue);
      }, 2400);
    }
  },

  // la fonction se base sur la ligne de dialogue sélectionné pour définir le lancement de différent évènement.
  dialogueFace: function() {

    switch (app.numberDialogue) {
      case 3: app.heroFace(hero.fold); break;
      case 6: app.heroFace(hero.creepy); break;
      case 7: app.heroFace(hero.wink); break;
      case 9: app.heroFace(hero.head); break;
      case 11: app.heroFace(hero.wink); break;
      case 12: app.heroFace(hero.head); break;
      case 17: app.heroFace(hero.fold); break;
      case 19: app.heroFace(hero.head); break;
      case 21: app.heroFace(hero.close); break;
      case 22: $(".none").fadeIn(1200); break;
      case 23: app.heroFace(hero.fire);
               requestAnimationFrame(app.mooveBody);
               requestAnimationFrame(app.mooveHead);
               $("#audioPlayer")[0].play();
      break;
    }

  },

  machine: function(int) {

    app.dialogueFace();

    app.interval = setInterval(function() {
      // fichier audio contenant les onomatopés lorsque le personnage parle.
      $("#talk")[0].play();

      // on va chercher dans le tableau dialogue le nom du string associé. charAt sert à récupérer chaque caractère du string
      app.str = dialogue[int].charAt(app.line);

      // l'écriture automatique s'arrête à partir du moment ou la longueur du string est atteinte
      if (dialogue[int].length === app.line) {
        $("#talk")[0].pause()

        // On remet tout à zero
        app.finish = "";
        app.line = 0;
        dialogue[int] = null;
        clearInterval(app.interval);

        // renvoi vers la sélection d'une nouvelle ligne de dialogue
        app.dialogueSelector();

       } else {
        // On incrémante chaque caractère récupéré grâce à 'str' dans 'finish'
        app.finish += app.str;

        // qu'on ajoute ensuite dans la div "#text"
        $('#text').text(app.finish)

        app.line++;
      }
    }, 50);

  },

};

$(app.init);
