/*
 * mc_out.js
 * CPQ Exit Portal
 * OriginalMS v62 Scripting Project
 */
 
function enter(pi) {
    pi.warp(980000000, "out00");
    if (pi.getPlayer().getMonsterCarnival() != null) {
        pi.getPlayer().setMonsterCarnival(null);
    }
    return true;
}
