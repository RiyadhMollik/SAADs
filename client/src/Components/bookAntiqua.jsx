import jsPDF from "jspdf";

jsPDF.API.events.push(['addFonts', function () {
  this.addFileToVFS('BookAntiqua.ttf', 'BASE64_STRING_HERE');
  this.addFont('BookAntiqua.ttf', 'BookAntiqua', 'normal');
}]);
