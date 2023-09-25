// NOTE: when adding a new service year, make sure to add that year to the switches in each base price code as well as the
//       the discount code
export type ServiceYear = 2020 | 2021 | 2022;

// NOTE: when adding a new service type, make sure that you add a function to get the value, and then update the getPrice function
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }) =>
{
    let newSelection = [...previouslySelectedServices];

    if (action.type == "Select") {
        if (!newSelection.includes(action.service)) {
            let include = true;

            // a bluraypacakge can only be included if the user
            // has selected the video recording package
            if (action.service == "BlurayPackage") {
                include = newSelection.includes("VideoRecording");
            }

            // we only handle a two day event if photography OR 
            // wedding seesion is included already
            if (action.service == "TwoDayEvent") {
                include = newSelection.includes("WeddingSession") ||
                    newSelection.includes("Photography");
            }

            if (include) {
                newSelection.push(action.service);
            }
        }
    }

    if (action.type == "Deselect") {
        if (newSelection.includes(action.service)) {
            let index = newSelection.indexOf(action.service);
            delete newSelection[index];

            // here we check to make sure that, if we removed the video recording,
            // we would then also remove the bluraypackage, if it exists
            if (action.service == "VideoRecording") {

                // remove the bluraypackage since they don't have any video
                if (newSelection.includes("BlurayPackage")) {
                    index = newSelection.indexOf("BlurayPackage");
                    delete newSelection[index];
                }
            }
            
            // ensure that a two day event is removed if we
            // don't have either a photography service or a video service
            if (newSelection.includes("TwoDayEvent")) {
                if (!newSelection.includes("Photography") &&
                !newSelection.includes("VideoRecording")) {
                    index = newSelection.indexOf("TwoDayEvent");
                    delete newSelection[index];
                }
            }
        }
    }

    // we want to filter out the undefined features that were removed
    // from the array
    return newSelection.filter(function(e){return e != undefined});
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) =>
{
    let basePrice = 0;

    selectedServices.forEach(service => {
        basePrice += getPrice(service, selectedYear);
    });

    let finalPrice = basePrice;

    finalPrice -= getDicountPhotoVideo(selectedServices, selectedYear);
    finalPrice -= getDiscountWedding(selectedServices, selectedYear);

    return { basePrice, finalPrice };
};

// discount code
// -------------------------------
function getDicountPhotoVideo(selectedServices: ServiceType[], selectedYear: ServiceYear) {
    if (selectedServices.includes("Photography") &&
        selectedServices.includes("VideoRecording")) {
        switch (selectedYear) {
            case 2020:
                return 1200;
            case 2021:
                return 1300;
            case 2022:
                return 1300;
        }
    }

    // no discount found!
    return 0;
}

function getDiscountWedding(selectedServices: ServiceType[], selectedYear: ServiceYear) {

    // ensure that we have a wedding session in our selected services
    if (selectedServices.includes("WeddingSession")) {

        // in the year 2022, the pricing changed
        if (selectedYear == 2022) {

            // if they have photography, we remove the entire cost of
            // the wedding session
            if (selectedServices.includes("Photography")) {
                return getPriceWeddingSession(selectedYear);
            }
        }

        // every other year, if the photo or video options are selected
        // provide a discount of 300
        if (selectedServices.includes("Photography") ||
            selectedServices.includes("VideoRecording")) {
            return 300;
        }
    }

    // no discount found!
    return 0;
}
// -------------------------------

// base price code:
// ===============================
function getPrice(service: ServiceType, year: ServiceYear) {
    switch (service) {
        case "BlurayPackage":
            return getPriceBluray(year);
        case "Photography":
            return getPricePhotography(year);
        case "TwoDayEvent":
            return getPriceTwoDayEvent(year);
        case "VideoRecording":
            return getPriceVideo(year);
        case "WeddingSession":
            return getPriceWeddingSession(year);
    }

    return 0;
}

function getPriceBluray(selectedYear: ServiceYear) {
    return 300;
}

function getPricePhotography(selectedYear: ServiceYear) {
    switch (selectedYear) {
        case 2021:
            return 1800;
        case 2022:
            return 1900;
        default:
            return 1700;
    }
}

function getPriceVideo(selectedYear: ServiceYear) {
    switch (selectedYear) {
        case 2021:
            return 1800;
        case 2022:
            return 1900;
        default:
            return 1700;
    }
}

function getPriceTwoDayEvent(selectedYear: ServiceYear) {
    return 400;
}

function getPriceWeddingSession(selectedYear: ServiceYear) {
    return 600;
}
// ===============================