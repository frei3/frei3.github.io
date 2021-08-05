$(document).ready( function() {
  // 2 Ziffern erzwingen
  function force2Digits( myNumber ) {
    if( myNumber < 10 ) {
      return '0' + myNumber;
    } else {
      return myNumber;
    }
  }
  // Restzeit formatieren
  function timeLeft( sec ) {
    var h = Math.floor( sec / 3600 );
    var m = Math.floor( (sec % 3600) / 60 );
    var s = Math.floor( sec % 60 );
    return force2Digits(h) + ':' + force2Digits(m) + ':' + force2Digits(s);
  }

  // Initialer Abruf der Wartezeit und Update-Intervall-Funktion starten
  $.get( 'https://frei3.github.io/f3-maintenance-config.json', [], function(data) {
    var now = Date.now();
    var nowDate = new Date();
    // Differenz in Sekunden
    var diff = Math.floor( ( data.comebackMillisec - now ) / 1000 );
    if( diff < 0 ) {
			// Mitternacht von Heute morgen Unix-Timestamp
			var currentDateMidnight = (new Date( nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() )).getTime();
			// Halbstunden-Differenz
			var hhdiff = Math.floor( ( now - currentDateMidnight ) / 1800000 );
			// übernächste Halbstundenmarke
			var diff = Math.floor( ( currentDateMidnight + 1800000 * (hhdiff + 2) - now ) / 1000 );
    }
    
    // Funktion, um den Timer zu aktualisieren
    var elapsedSeconds = 0;
    var updateTimerInterval;
    var updateTimer = function() {
      if( elapsedSeconds > diff ) {
        // Zähler wird gestoppt, wenn geplante Pause überschritten wurde
        clearInterval( updateTimerInterval );
      } else {
        // Aktualisierung des Timers
        $('.timer').text( timeLeft( diff - elapsedSeconds ) );
        elapsedSeconds++;
      }          
    };
    
    // Erste Ausführung, um sofort die Zeit zu sehen
    updateTimer();
    // Eigentliche Intervall-Ausführung
    setInterval( updateTimer, 1000 );
  }, 'json' ); 
});
