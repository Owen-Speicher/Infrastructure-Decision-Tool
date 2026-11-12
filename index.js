const readline = require("readline-sync");

// Ask for a valid CIDR between 16 and 30
function getCIDR(question) {
    while (true) {
        let input = readline.question(question).trim();

        // Allow either 24 or /24
        if (input.startsWith("/")) {
            input = input.substring(1);
        }

        let number = Number(input);

        if (input !== "" && Number.isInteger(number) &&
            number >= 16 && number <= 30) {
            return number;
        }

        console.log("Invalid CIDR. Enter a number between 16 and 30.");
    }
}

// Ask for a valid whole number
function getWholeNumber(question, allowZero) {
    while (true) {
        let input = readline.question(question).trim();
        let number = Number(input);

        if (input !== "" && Number.isSafeInteger(number)) {
            if (number > 0 || (allowZero && number === 0)) {
                return number;
            }
        }

        console.log("Invalid input. Enter a valid whole number.");
    }
}

// Ask for a valid monthly budget
function getBudget() {
    while (true) {
        let input = readline.question("Enter monthly budget: ").trim();
        let budget = Number(input);

        if (input !== "" && Number.isFinite(budget) && budget >= 0) {
            return budget;
        }

        console.log("Invalid budget. Enter a number of 0 or greater.");
    }
}

// Ask a yes or no question
function getYesNo(question) {
    while (true) {
        let answer = readline.question(question).trim().toLowerCase();

        if (answer === "yes" || answer === "no") {
            return answer;
        }

        console.log("Invalid input. Please enter yes or no.");
    }
}

// Part A - Subnet Host Checker
function subnetChecker() {
    console.log("\n--- Subnet Host Checker ---");

    let vpc = getCIDR("Enter VPC CIDR (16-30): ");
    let subnet = getCIDR("Enter Subnet CIDR (16-30): ");
    let devices = getWholeNumber("Enter number of devices: ", false);

    // Check if the subnet fits within the VPC
    if (subnet < vpc) {
        console.log("Subnet CIDR is NOT consistent with VPC CIDR.");
        return;
    }

    console.log("Subnet CIDR is consistent with VPC CIDR.");

    // Calculate available IP addresses
    let totalIPs = 2 ** (32 - subnet);
    let usableIPs = totalIPs - 5;

    console.log("Total IP addresses: " + totalIPs);
    console.log("Usable IP addresses: " + usableIPs);
    console.log("Devices required: " + devices);
    if (devices <= usableIPs) {
        console.log("Subnet is sufficient for " + devices + " devices.");
        console.log("Unused IP addresses: " + (usableIPs - devices));
    } else {
        console.log("Subnet is NOT sufficient.");
        console.log("Additional IPs needed: " + (devices - usableIPs));
    }
}

// Part B - Compute Environment Selector
function computeSelector() {
    console.log("\n--- Compute Environment Selector ---");

    let app = "";

    while (app === "") {
        app = readline.question("Enter application name: ").trim();

        if (app === "") {
            console.log("Application name cannot be empty.");
        }
    }

    let users = getWholeNumber("Enter monthly users: ", true);
    let budget = getBudget();
    let ha = getYesNo("High availability? (yes/no): ");

    let recommendation = "";
    let level = 1;

    if (users > 10000 || ha === "yes") {
        recommendation = "EC2 + Load Balancer + Auto Scaling";
        level = 3;
    } else if (users >= 1000) {
        recommendation = "EC2 + Load Balancer";
        level = 2;
    } else {
        recommendation = "Single EC2";
    }

    console.log("\nApplication: " + app);
    console.log("Monthly users: " + users);
    console.log("Monthly budget: $" + budget.toFixed(2));
    console.log("High availability: " + ha);
    console.log("Recommended: " + recommendation);

    // Budget warnings
    if (budget < 1000 && level > 1) {
        console.log("Warning: Budget may be too low for this setup.");
    } else if (budget >= 1000 && budget <= 3000 && level === 3) {
        console.log("Warning: Auto Scaling may exceed your budget.");
    }
}

// Main menu
let running = true;

while (running) {
    console.log("\n=== Infrastructure Decision Tool ===");
    console.log("1. Subnet Host Checker");
    console.log("2. Compute Environment Selector");
    console.log("3. Exit");

    let choice = readline.question("Choose an option: ").trim();

    if (choice === "1") {
        subnetChecker();
    } else if (choice === "2") {
        computeSelector();
    } else if (choice === "3") {
        console.log("Goodbye!");
        running = false;
    } else {
        console.log("Invalid option. Choose 1, 2, or 3.");
    }
}
