"use strict";


/* =========================================================
   PVPBattles TierList
========================================================= */


/*
    Tier points

    HT1 = 60
    LT1 = 45
    HT2 = 30
    LT2 = 20
    HT3 = 10
    LT3 = 6
    HT4 = 4
    LT4 = 3
    HT5 = 2
    LT5 = 1
*/

const TIER_POINTS = {
    HT1: 60,
    LT1: 45,

    HT2: 30,
    LT2: 20,

    HT3: 10,
    LT3: 6,

    HT4: 4,
    LT4: 3,

    HT5: 2,
    LT5: 1
};


/*
    Kit information
*/

const KITS = {
    sword: {
        name: "Sword",
        image: "../assets/tierlist/sword.png"
    },

    axe: {
        name: "Axe",
        image: "../assets/tierlist/axe.png"
    },

    pot: {
        name: "Pot",
        image: "../assets/tierlist/pot.png"
    },

    nethop: {
        name: "NethOP",
        image: "../assets/tierlist/nethop.png"
    },

    smp: {
        name: "SMP",
        image: "../assets/tierlist/smp.png"
    },

    uhc: {
        name: "UHC",
        image: "../assets/tierlist/uhc.png"
    },

    mace: {
        name: "Mace",
        image: "../assets/tierlist/mace.png"
    },

    endgame: {
        name: "EndGame",
        image: "../assets/tierlist/endgame.png"
    }
};


/*
    Prototype players

    Replace these with real players later.
*/

const players = [

    {
        name: "NaruMaroMC",

        uuid: "00000000-0000-0000-0000-000000000000",

        kits: {
            sword: "LT2",
            axe: "HT2",
            pot: "HT3",
            nethop: "LT2",
            smp: "HT3",
            uhc: "LT3",
            mace: "HT3",
            endgame: "LT3"
        }
    },

    {
        name: "PlayerTwo",

        uuid: "00000000-0000-0000-0000-000000000002",

        kits: {
            sword: "HT2",
            axe: "LT2",
            pot: "LT2",
            nethop: "HT3",
            smp: "LT3",
            uhc: "HT3",
            mace: "LT3",
            endgame: "HT3"
        }
    },

    {
        name: "PlayerThree",

        uuid: "00000000-0000-0000-0000-000000000003",

        kits: {
            sword: "LT3",
            axe: "HT3",
            pot: "LT3",
            nethop: "LT3",
            smp: "HT4",
            uhc: "LT4",
            mace: "HT4",
            endgame: "LT4"
        }
    },

    {
        name: "PlayerFour",

        uuid: "00000000-0000-0000-0000-000000000004",

        kits: {
            sword: "HT4",
            axe: "LT4",
            pot: "HT4",
            nethop: "LT4",
            smp: "HT4",
            uhc: "LT4",
            mace: "LT4",
            endgame: "HT5"
        }
    },

    {
        name: "PlayerFive",

        uuid: "00000000-0000-0000-0000-000000000005",

        kits: {
            sword: "LT5",
            axe: "HT5",
            pot: "LT5",
            nethop: "LT5",
            smp: "HT5",
            uhc: "LT5",
            mace: "HT5",
            endgame: "LT5"
        }
    }

];


/* =========================================================
   Helpers
========================================================= */

function getTierPoints(tier) {

    return TIER_POINTS[tier] || 0;

}


function getOverallPoints(player) {

    return Object.values(player.kits)
        .reduce(
            (total, tier) => total + getTierPoints(tier),
            0
        );

}


/*
    Overall Tier

    This is intentionally kept in one function so the
    official PVPBattles Overall thresholds can be changed
    later without rewriting the rest of the website.
*/

function getOverallTier(points) {

    if (points >= 240) return "HT1";
    if (points >= 180) return "LT1";

    if (points >= 130) return "HT2";
    if (points >= 90) return "LT2";

    if (points >= 55) return "HT3";
    if (points >= 35) return "LT3";

    if (points >= 22) return "HT4";
    if (points >= 14) return "LT4";

    if (points >= 8) return "HT5";

    return "LT5";
}


function getTierClass(tier) {

    return `tier-${tier.toLowerCase()}`;

}


function getSkinUrl(uuid, name) {

    /*
        UUID is preferred.

        If a real UUID is unavailable, use the username.
    */

    const identifier =
        uuid &&
        uuid !== "00000000-0000-0000-0000-000000000000"
            ? uuid
            : encodeURIComponent(name);

    return `https://mc-heads.net/avatar/${identifier}/100`;

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   Prepare players
========================================================= */

players.forEach(player => {

    player.points = getOverallPoints(player);

    player.overall = getOverallTier(player.points);

});


/* =========================================================
   DOM
========================================================= */

const playerList =
    document.getElementById("player-list");

const emptyState =
    document.getElementById("empty-state");

const searchInput =
    document.getElementById("player-search");

const kitTabs =
    document.querySelectorAll(".kit-tab");

const modal =
    document.getElementById("player-modal");

const modalClose =
    document.getElementById("modal-close");

const modalBackdrop =
    document.querySelector(".modal-backdrop");

const modalSkin =
    document.getElementById("modal-skin");

const modalName =
    document.getElementById("modal-name");

const modalOverallTier =
    document.getElementById("modal-overall-tier");

const modalOverallPoints =
    document.getElementById("modal-overall-points");

const modalKits =
    document.getElementById("modal-kits");


let currentKit = "overall";
let currentSearch = "";


/* =========================================================
   Sorting
========================================================= */

function getPlayersForCurrentView() {

    let result = players.filter(player => {

        if (!currentSearch) {
            return true;
        }

        return player.name
            .toLowerCase()
            .includes(currentSearch.toLowerCase());

    });


    if (currentKit === "overall") {

        result.sort((a, b) => {

            if (b.points !== a.points) {
                return b.points - a.points;
            }

            return a.name.localeCompare(b.name);

        });

        return result;
    }


    result.sort((a, b) => {

        const aPoints =
            getTierPoints(a.kits[currentKit]);

        const bPoints =
            getTierPoints(b.kits[currentKit]);

        if (bPoints !== aPoints) {
            return bPoints - aPoints;
        }

        return a.name.localeCompare(b.name);

    });

    return result;
}


/* =========================================================
   Render ranking
========================================================= */

function renderPlayers() {

    const visiblePlayers =
        getPlayersForCurrentView();

    playerList.innerHTML = "";


    if (visiblePlayers.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }


    emptyState.classList.add("hidden");


    visiblePlayers.forEach((player, index) => {

        const row =
            document.createElement("div");

        row.className = "player-row";

        let tier;
        let points;


        if (currentKit === "overall") {

            tier = player.overall;
            points = player.points;

        } else {

            tier = player.kits[currentKit];
            points = getTierPoints(tier);

        }


        row.innerHTML = `

            <span class="rank-number">
                #${index + 1}
            </span>

            <div class="player-info">

                <img
                    class="player-skin"
                    src="${getSkinUrl(
                        player.uuid,
                        player.name
                    )}"
                    alt=""
                    loading="lazy"
                >

                <div>

                    <div class="player-name">
                        ${escapeHTML(player.name)}
                    </div>

                    <div class="player-uuid">
                        ${escapeHTML(player.uuid)}
                    </div>

                </div>

            </div>

            <span
                class="player-tier ${getTierClass(tier)}"
            >
                ${tier}
            </span>

            <span class="player-points">
                ${points}
                <span>Points</span>
            </span>

        `;


        row.addEventListener(
            "click",
            () => openPlayer(player)
        );


        playerList.appendChild(row);

    });

}


/* =========================================================
   Player modal
========================================================= */

function openPlayer(player) {

    modal.classList.remove("hidden");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";


    modalSkin.src =
        getSkinUrl(
            player.uuid,
            player.name
        );

    modalSkin.alt =
        `${player.name} skin`;


    modalName.textContent =
        player.name;


    modalOverallTier.textContent =
        player.overall;


    modalOverallTier.className =
        getTierClass(player.overall);


    modalOverallPoints.textContent =
        `${player.points} Points`;


    modalKits.innerHTML = "";


    Object.entries(KITS).forEach(
        ([key, kit]) => {

            const tier =
                player.kits[key] || "LT5";

            const points =
                getTierPoints(tier);


            const item =
                document.createElement("div");

            item.className =
                "kit-result";


            item.innerHTML = `

                <img
                    src="${kit.image}"
                    alt=""
                >

                <div class="kit-result-info">

                    <span class="kit-result-name">
                        ${kit.name}
                    </span>

                    <span class="kit-result-points">
                        ${points} Points
                    </span>

                </div>

                <span
                    class="kit-result-tier ${getTierClass(tier)}"
                >
                    ${tier}
                </span>

            `;


            modalKits.appendChild(item);

        }
    );

}


function closePlayer() {

    modal.classList.add("hidden");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


/* =========================================================
   Kit tabs
========================================================= */

kitTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            kitTabs.forEach(
                otherTab =>
                    otherTab.classList.remove("active")
            );

            tab.classList.add("active");


            currentKit =
                tab.dataset.kit;


            renderPlayers();

        }
    );

});


/* =========================================================
   Search
========================================================= */

searchInput.addEventListener(
    "input",
    event => {

        currentSearch =
            event.target.value.trim();

        renderPlayers();

    }
);


/* =========================================================
   Modal events
========================================================= */

modalClose.addEventListener(
    "click",
    closePlayer
);

modalBackdrop.addEventListener(
    "click",
    closePlayer
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {

            closePlayer();

        }

    }
);


/* =========================================================
   Initial render
========================================================= */

renderPlayers();
