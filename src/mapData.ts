interface ResourceGeneration {
    money: number;
    supplies: number;
    manpower: number;
}

interface Territory {
    id: number;
    name: string;
    ownerId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    resourceGeneration: ResourceGeneration;
    terrain: string;
    handleBattleResult: (attackSuccessful: boolean, attackerId: number) => void;
}

const territories: Territory[] = [];
const mapWidth = 1000;
const mapHeight = 500;
const numTerritories = 10;
const territoryWidth = mapWidth / Math.ceil(Math.sqrt(numTerritories));
const territoryHeight = mapHeight / Math.ceil(Math.sqrt(numTerritories));

for (let i = 0; i < numTerritories; i++) {
    const x = (i % Math.ceil(Math.sqrt(numTerritories))) * territoryWidth;
    const y = Math.floor(i / Math.ceil(Math.sqrt(numTerritories))) * territoryHeight;
    territories.push({
        id: i + 1,
        name: `Territory ${i + 1}`,
        ownerId: Math.floor(Math.random() * 2) + 1,
        x: x,
        y: y,
        width: territoryWidth,
        height: territoryHeight,
        resourceGeneration: {
            money: 100 + Math.floor(Math.random() * 100),
            supplies: 50 + Math.floor(Math.random() * 50),
            manpower: 25 + Math.floor(Math.random() * 25),
        },
        terrain: ["Plains", "Forest", "Hills", "Mountains"][Math.floor(Math.random() * 4)],
        handleBattleResult: function (attackSuccessful: boolean, attackerId: number) {
            if (attackSuccessful) {
                this.ownerId = attackerId;
            }
        }
    });
}

// You can log the array out to the console using console.log(territories) if you want to view it. 

export default territories;
