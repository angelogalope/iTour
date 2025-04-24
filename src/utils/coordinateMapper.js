export const mapToRealCoordinates = (x, y) => {
    const predefinedCoordinates = [
        { label: "CSU New Administration Building", x: -1080.436207793143, y: -383.545740083529 },
        { label: "CSU Gymnasium", x: -492.59935615770456, y: 724.672873474859 },
        { label: "CSU Oval", x: -748.954588961493, y: 312.6949087827458 },
        { label: "CSU Library - Hero Learning Commons", x: -1519.6310149395997, y: 183.0560049636585 },
        { label: "Iwag Hall - College of Education", x: -2440.926672223835, y: -290.95457978998365 },
		{ label: "College of Agriculture and Agri-Industries", x: -2464.1855665091252, y: 398.0764034134249 },
		{ label: "Batok Hall - College of Mathematics and Natural Sciences", x: -1586.497383633348, y: -160.29843906526347 },
		{ label: "Kinaadman Hall - College of Humanities and Social Sciences", x: -301.063163130692, y: -483.3560232065601 },
		{ label: "Hiraya Hall - College of Computing and Information Sciences", x: 166.1301967575274, y: -274.1656584776533 },
		{ label: "Hinang Hall - College of Engineering and Geosciences", x: 421.48897622075447, y: 421.48897622075447 },
    ];

    const predefinedDestinations = [
        { name: "CSU Main Gate", lat: 8.959493, lng: 125.596513 },
        { name: "CSU Green Gate", lat: 8.957209, lng: 125.598723 },
        { name: "CSU Library - Hero Learning Commons", lat: 8.95785, lng: 125.596443 },
        { name: "CSU New Administration Building", lat: 8.957193, lng: 125.597414 },
        { name: "CSU Old Administration Building", lat: 8.956923, lng: 125.597243 },
        { name: "CSU Gymnasium", lat: 8.955985, lng: 125.595789 },
        { name: "College of Agriculture and Agri-Industries", lat: 8.959122, lng: 125.595886 },
        { name: "Iwag Hall - College of Education", lat: 8.959328, lng: 125.596942 },
        { name: "Batok Hall - College of Mathematics and Natural Sciences", lat: 8.957924, lng: 125.597023 },
        { name: "Kinaadman Hall - College of Humanities and Social Sciences", lat: 8.956075, lng: 125.59764 },
        { name: "CAS Building", lat: 8.955616, lng: 125.596803 },
        { name: "Hiraya Hall - College of Computing and Information Sciences", lat: 8.955253, lng: 125.597685 },
        { name: "Hinang Hall - College of Engineering and Geosciences", lat: 8.954872, lng: 125.597723 },
        { name: "Masawa Hall", lat: 8.955513, lng: 125.598493 },
        { name: "COFES - College of Forestry and Environmental Sciences", lat: 8.954872, lng: 125.597723 },
    ];

    // Find the matching coordinate in predefinedCoordinates
    const match = predefinedCoordinates.find(
        (coord) => coord.x === x || coord.y === y
    );

    if (match) {
        // Find the corresponding real-world destination
        const realCoord = predefinedDestinations.find(
            (dest) =>
                dest.name.toLowerCase().trim() ===
                match.label.toLowerCase().trim()
        );
        return { name: realCoord.name, lat: realCoord.lat, lng: realCoord.lng };
    }

    return null;
};