const { Console } = require('console-mpds');
const console = new Console();

playMastermind();

function playMastermind() {
    do {
        playGame();
    } while (isResumed());

    function playGame() {
        const MAX_ATTEMPTS = 10;
        const COMBINATION_LENGTH = 4;
        const VALID_COLORS = ['r', 'g', 'b', 'y', 'c', 'm'];
        const secretCombination = getSecretCombination(VALID_COLORS, COMBINATION_LENGTH);
        let proposedCombinations = [];
        let isWinner;
        let hasAttempts;
        console.writeln('----- MASTERMIND -----');
        do {
            hasAttempts = proposedCombinations.length < MAX_ATTEMPTS;
            writeBoard(secretCombination, proposedCombinations, hasAttempts);
            if (hasAttempts) {
                readProposedCombination(proposedCombinations, VALID_COLORS, COMBINATION_LENGTH);
            }
            isWinner = secretCombination === proposedCombinations[proposedCombinations.length - 1];
        } while (hasAttempts && !isWinner);
        writeResult(isWinner);

        function getSecretCombination(validColors, combinationLength) {
            let secretColors = getRandomColors(validColors, combinationLength);
            const SHUFFLE_ITERATIONS = 1000;
            shuffleArray(secretColors, SHUFFLE_ITERATIONS);
            let secret = '';
            for (const color of secretColors) {
                secret += color;
            }
            return secret;

            function getRandomColors(validColors, combinationLength) {
                let randomColors = [];
                do {
                    const randomColor = validColors[randomIntFromInterval(0, validColors.length - 1)];
                    let isIncluded = false;
                    for (let i = 0; !isIncluded && i < randomColors.length; i++) {
                        isIncluded = randomColors[i] === randomColor;
                    }
                    if (!isIncluded) {
                        randomColors[randomColors.length] = randomColor;
                    }
                } while (randomColors.length < combinationLength);
                return randomColors;
            }
            function shuffleArray(array, iterations) {
                for (let i = 0; i < iterations; i++) {
                    const a = randomIntFromInterval(0, array.length - 1);
                    const b = randomIntFromInterval(0, array.length - 1);
                    const temp = array[a];
                    array[a] = array[b];
                    array[b] = temp;
                }
            }
            function randomIntFromInterval(min, max) {
                const random = Math.random() * (max - min + 1) + min;
                return random - (random % 1);
            }
        }
        function writeBoard(secretCombination, proposedCombinations, hasAttempts) {
            console.writeln(`\n${proposedCombinations.length} attempt(s):`);
            writeSecretCombination(secretCombination, hasAttempts);
            for (let i = 0; i < proposedCombinations.length; i++) {
                const blacks = getBlacks(secretCombination, proposedCombinations[i]);
                const whites = getWhites(secretCombination, proposedCombinations[i]);
                console.writeln(`${proposedCombinations[i]} --> ${blacks} blacks and ${whites} whites`);
            }

            function writeSecretCombination(secretCombination, isHidden = true) {
                const HIDDEN_CHAR = '*';
                let msg = '';
                for (const color of secretCombination) {
                    msg += isHidden ? HIDDEN_CHAR : color;
                }
                console.writeln(msg);
            }
            function getBlacks(secretCombination, proposedCombination) {
                let blacks = 0;
                for (let i = 0; i < secretCombination.length; i++) {
                    if (proposedCombination[i] === secretCombination[i]) {
                        blacks++;
                    }
                }
                return blacks;
            }
            function getWhites(secretCombination, proposedCombination) {
                let whites = 0;
                for (let i = 0; i < secretCombination.length; i++) {
                    for (let j = 0; j < proposedCombination.length; j++) {
                        if (i !== j && secretCombination[i] === proposedCombination[j]) {
                            whites++;
                        }
                    }
                }
                return whites;
            }
        }
        function readProposedCombination(proposedCombinations, validColors, combinationLength) {
            let combination;
            let error;
            do {
                combination = console.readString(`Propose a combination (${validColors}): `);
                error = validateCombination(combination, validColors, combinationLength);
                if (error !== '') {
                    console.writeln(error);
                }
            } while (error !== '');
            proposedCombinations[proposedCombinations.length] = combination;

            function validateCombination(combination, validColors, combinationLength) {
                if (combination.length !== combinationLength) {
                    return `Wrong length, it must be ${combinationLength}`;
                }
                let isValid = true;
                for (let i = 0; isValid && i < combination.length; i++) {
                    isValid = isValidColor(combination[i], validColors);
                }
                return isValid ? '' : `Wrong colors, they must be: ${validColors}`;

                function isValidColor(color, validColors) {
                    let isValid = false;
                    for (let i = 0; !isValid && i < validColors.length; i++) {
                        isValid = color === validColors[i];
                    }
                    return isValid;
                }
            }
        }
        function writeResult(isWinner) {
            let msg = `You've lost!!! :-(`;
            if (isWinner) {
                msg = `You've won!!! ;-)`;
            }
            console.writeln(msg);
        }
    }
    function isResumed() {
        const VALID_RESPONSES = ['y', 'Y', 'n', 'N'];
        let response;
        do {
            response = console.readString('Do you want to continue? (y/n):');
        } while (!isValid(response));
        return response === 'Y' || response === 'y';

        function isValid(response) {
            let isValid = false;
            for (let i = 0; !isValid && i < VALID_RESPONSES.length; i++) {
                isValid = response === VALID_RESPONSES[i];
            }
            return isValid;
        }
    }
}
