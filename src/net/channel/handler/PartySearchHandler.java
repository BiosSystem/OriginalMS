package net.channel.handler;

import client.MapleClient;
import net.AbstractMaplePacketHandler;
import tools.data.input.SeekableLittleEndianAccessor;

/**
 * Handles PARTY_SEARCH_REGISTER (0xBD) and PARTY_SEARCH_START (0xBF).
 *
 * In v62 GMS the Party Search panel lets players broadcast their LFP status
 * with a job category filter and lets others browse/join open parties.
 * The UI is handled client-side; the server only needs to acknowledge the
 * packet and keep state in the player object.
 */
public class PartySearchHandler extends AbstractMaplePacketHandler {

    @Override
    public void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {
        if (c.getPlayer() == null) {
            return;
        }
        // Packet layout: [byte mode] [int jobCategory or partyId]
        // mode 0 = register self as LFP, mode 1 = deregister
        int mode = slea.readByte();
        if (slea.available() >= 4) {
            int category = slea.readInt(); // job category filter (0=all, 1=warrior, …)
            if (mode == 0) {
                c.getPlayer().setPartySearch(true);
                c.getPlayer().setPartySearchCategory(category);
            } else {
                c.getPlayer().setPartySearch(false);
                c.getPlayer().setPartySearchCategory(0);
            }
        }
    }
}
