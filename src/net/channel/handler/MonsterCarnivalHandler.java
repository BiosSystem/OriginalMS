/*
This file is part of the OdinMS Maple Story Server
Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
Matthias Butz <matze@odinms.de>
Jan Christian Meyer <vimes@odinms.de>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License version 3
as published by the Free Software Foundation. You may not use, modify
or distribute this program under any other version of the
GNU Affero General Public License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package net.channel.handler;

import java.awt.Point;
import client.MapleCharacter;
import client.MapleClient;
import client.MapleDisease;
import client.status.MonsterStatus;
import net.AbstractMaplePacketHandler;
import server.life.MapleLifeFactory;
import server.life.MapleMonster;
import server.life.MobSkillFactory;
import tools.MaplePacketCreator;
import tools.data.input.SeekableLittleEndianAccessor;

public class MonsterCarnivalHandler extends AbstractMaplePacketHandler {

    private boolean isCPQ2Map(int mapId) {
        return mapId >= 980031000 && mapId <= 980031999;
    }

    @Override
    public void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {
        int tab = slea.readByte();
        int num = slea.readByte();
        int neededCP = getCPNeeded(tab, num);
        boolean cpq2 = isCPQ2Map(c.getPlayer().getMapId());
        if (c.getPlayer().getCP() < neededCP) {
            c.getSession().write(MaplePacketCreator.serverNotice(5, "You do not have enough CP to use this."));
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        if (tab == 0) { //only spawning for now..
            MapleMonster mob = MapleLifeFactory.getMonster(getMonsterIdByNum(num, cpq2));
            Point spawnPos = c.getPlayer().getMap().getRandomSP(c.getPlayer().getTeam());
            if (spawnPos == null) {
                c.getSession().write(MaplePacketCreator.serverNotice(5, "The monster cannot be summoned, as all spawn points are taken."));
                c.getSession().write(MaplePacketCreator.enableActions());
                return;
            }
            mob.setPosition(spawnPos);
            //c.getPlayer().getMap().spawnMonsterOnGroundBelow(mob, spawnPos);
            c.getPlayer().getMap().addMonsterSpawn(mob, 1, c.getPlayer().getTeam());
            c.getSession().write(MaplePacketCreator.enableActions());
        } else if (tab == 1) { //debuffs
            boolean dispel = false;
            MapleDisease debuff = null;
            boolean wholeParty = false;
            int skillId = -1;
            int level = -1;
            switch (num) {
                case 0: //darkness
                    debuff = MapleDisease.DARKNESS;
                    wholeParty = true;
                    skillId = 121;
                    level = 6;
                    break;
                case 1: //weakness
                    debuff = MapleDisease.WEAKEN;
                    wholeParty = true;
                    skillId = 122;
                    level = 7;
                    break;
                case 2: //curse
                    c.getSession().write(MaplePacketCreator.enableActions());
                    return;
                case 3: //poison
                    c.getSession().write(MaplePacketCreator.enableActions());
                    return;
                case 4: //slow
                    debuff = MapleDisease.SLOW;
                    wholeParty = true;
                    skillId = 126;
                    level = 6;
                    break;
                case 5: //seal
                    debuff = MapleDisease.SEAL;
                    skillId = 120;
                    level = 10;
                    break;
                case 6: //stun
                    debuff = MapleDisease.STUN;
                    skillId = 123;
                    level = 11;
                    break;
                case 7: //cancel buff	
                    dispel = true;
                    debuff = null;
                    break;
            }
            boolean done = false;
            if (debuff != null) {
                if (wholeParty) {
                    if (Math.random() < 0.8) { //80%
                        for (int i = 0; i < c.getPlayer().getParty().getEnemy().getMembers().size(); i++) {
                            MapleCharacter chr = c.getChannelServer().getPlayerStorage().getCharacterById(c.getPlayer().getParty().getEnemy().getMemberByPos(i).getId());
                            if (chr != null) {
                                chr.giveDebuff(debuff, MobSkillFactory.getMobSkill(skillId, level), true);
                            }
                        }
                    } else {
                        c.getSession().write(MaplePacketCreator.serverNotice(5, "Casting the spell failed."));
                    }
                } else if (c.getPlayer().getParty().getEnemy() != null) {
                    while (!done) {
                        for (int i = 0; i < c.getPlayer().getParty().getEnemy().getMembers().size(); i++) {
                            if (Math.random() > 0.4) {
                                MapleCharacter chr = c.getChannelServer().getPlayerStorage().getCharacterById(c.getPlayer().getParty().getEnemy().getMemberByPos(i).getId());
                                if (chr != null) {
                                    chr.giveDebuff(debuff, MobSkillFactory.getMobSkill(skillId, level), true);
                                    done = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (dispel) {
                while (!done) {
                    for (int i = 0; i < c.getPlayer().getParty().getEnemy().getMembers().size(); i++) {
                        if (Math.random() > 0.4) {
                            MapleCharacter chr = c.getChannelServer().getPlayerStorage().getCharacterById(c.getPlayer().getParty().getEnemy().getMemberByPos(i).getId());
                            if (chr != null) {
                                chr.dispel();
                                done = true;
                            }
                        }
                    }
                }
            }
            c.getSession().write(MaplePacketCreator.enableActions());
        } else if (tab == 2) { //protectors
            MonsterStatus status = null;
            switch (num) {
                case 0:
                    status = MonsterStatus.WEAPON_ATTACK_UP;
                    break;
                case 1:
                    status = MonsterStatus.WEAPON_DEFENSE_UP;
                    break;
                case 2:
                    status = MonsterStatus.MAGIC_ATTACK_UP;
                    break;
                case 3:
                    status = MonsterStatus.MAGIC_DEFENSE_UP;
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    status = MonsterStatus.WEAPON_IMMUNITY;
                    break;
                case 8:
                    status = MonsterStatus.MAGIC_IMMUNITY;
                    break;
            }
            if (status != null) {
                int success = c.getPlayer().getMap().spawnGuardian(status, c.getPlayer().getTeam());
                if (success == -1 || success == 0) {
                    if (success == -1) {
                        c.getSession().write(MaplePacketCreator.serverNotice(5, "The protector cannot be summoned, as all protector spots are taken."));
                    } else if (success == 0) {
                        c.getSession().write(MaplePacketCreator.serverNotice(5, "The protector is already summoned."));
                    }
                    c.getSession().write(MaplePacketCreator.enableActions());
                    return;
                }
            } else {
                c.getSession().write(MaplePacketCreator.serverNotice(5, "The protector cannot be summoned."));
                c.getSession().write(MaplePacketCreator.enableActions());
            }
            c.getSession().write(MaplePacketCreator.enableActions());
        }
        c.getPlayer().gainCP(-neededCP);
        c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.playerSummoned(c.getPlayer().getName(), tab, num));
    }

    public int getMonsterIdByNum(int num, boolean cpq2) {
        int mid = 0;
        num++;

        if (cpq2) {
            // CPQ2 (Magatia) monster pool
            switch (num) {
                case 1:  mid = 9300149; break; // Reinforced Iron Mutae
                case 2:  mid = 9300150; break; // Hector
                case 3:  mid = 9300151; break; // Security Camera
                case 4:  mid = 9300152; break; // Stereo Mist
                case 5:  mid = 9300153; break; // Soul Teddy
                case 6:  mid = 9300154; break; // Homunculus
                case 7:  mid = 9300155; break; // Void Mage
                case 8:  mid = 9300156; break; // Reinforced Iron Mutae Chief
                case 9:  mid = 9300157; break; // Roid
                case 10: mid = 9300158; break; // King Block Golem
                default: mid = 9300149; break;
            }
        } else {
            // CPQ1 (Ludibrium) monster pool
            switch (num) {
                case 1:  mid = 9300127; break; // Brown Teddy
                case 2:  mid = 9300128; break; // Bloctopus
                case 3:  mid = 9300129; break; // Ratz
                case 4:  mid = 9300130; break; // Chronos
                case 5:  mid = 9300131; break; // Toy Trojan
                case 6:  mid = 9300132; break; // Tick-Tock
                case 7:  mid = 9300133; break; // Robo
                case 8:  mid = 9300134; break; // King Bloctopus
                case 9:  mid = 9300135; break; // Master Chronos
                case 10: mid = 9300136; break; // Rombot
                default: mid = 9300127; break;
            }
        }
        return mid;
    }

    /*
	Brown Teddy: 7CP
	Bloctopus: 7CP
	Ratz: 8CP
	Chronos: 8CP
	Toy Trojan: 9CP
	Tick-Tock: 9CP
	Robo: 10CP
	Block Golem King: 11CP
	Master Chronos: 12CP
	Rombot: 30CP

     */
    public int getCPNeeded(int tab, int pos) {
        switch (tab) {
            case 0: { //mob
                switch (pos) {
                    case 0:
                        return 7;
                    case 1:
                        return 7;
                    case 2:
                        return 8;
                    case 3:
                        return 8;
                    case 4:
                        return 9;
                    case 5:
                        return 9;
                    case 6:
                        return 10;
                    case 7:
                        return 11;
                    case 8:
                        return 12;
                    case 9:
                        return 30;
                    default:
                        throw new RuntimeException("Position out of range? Wtf?");
                }
            }

            case 1: { //debuff
                switch (pos) {
                    case 0:
                        return 17;
                    case 1:
                        return 19;
                    case 2:
                        return 12;
                    case 3:
                        return 19;
                    case 4:
                        return 16;
                    case 5:
                        return 14;
                    case 6:
                        return 22;
                    case 7:
                        return 18;
                }
            }

            case 2: { //protector
                switch (pos) {
                    case 0:
                        return 17;
                    case 1:
                        return 16;
                    case 2:
                        return 17;
                    case 3:
                        return 16;
                    case 4:
                        return 13;
                    case 5:
                        return 16;
                    case 6:
                        return 12;
                    case 7:
                        return 35;
                    case 8:
                        return 35;
                }
            }
        }
        throw new RuntimeException("Wtf? Reached the end of the method...");
    }
}
