load('nashorn:mozilla_compat.js');
/*
 * LeaderMS 2012 
 */
var setupTask;

function init() {
    scheduleNew();
}

function scheduleNew() {
    var cal = java.util.Calendar.getInstance();
    cal.set(java.util.Calendar.HOUR, 1);
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    var nextTime = cal.getTimeInMillis();
    while (nextTime <= java.lang.System.currentTimeMillis())
        nextTime += 300 * 1000;
    setupTask = em.scheduleAtTimestamp("start", nextTime);
}

function cancelSchedule() {
    setupTask.cancel(true);
}

function start() {
    scheduleNew();
    var Message = new Array("Bem vindo ao LeaderMS!" ,"Por favor nao use a linguagem impropia neste jogo.", "Abuso VERBAL no jogo ou outro tipo nao serao tolerados neste jogo. Usuarios que abusarem podem ser bloqueados do jogo.","Reporte qualquer erro/bugs em nossa comunidade ou forum!","Use @comandos para ver a lista de comandos disponiveis!");
    em.getChannelServer().yellowWorldMessage("[Dicas LeaderMS] " + Message[Math.floor(Math.random() * Message.length)]);
}