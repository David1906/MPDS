const { Console } = require('console-mpds');
const console = new Console();

playMastermind();

function playMastermind() {
    do {
        playGame();
    } while (isResumed());

    function playGame() {
        const COMBINATION_LENGTH = 4;
        const COLORS = 'rgbycm';
        const secret = getSecret();
        let proposedCombinations = [];
        let blacks = [];
        let whites = [];
        let isWinner;
        let hasAttempts;
        console.writeln('----- MASTERMIND -----');
        do {
            const attempt = proposedCombinations.length;
            writeBoard(secret, proposedCombinations, blacks, whites, attempt);
            hasAttempts = hasAvailableAttempts(attempt);
            if (hasAttempts) {
                proposedCombinations[attempt] = readProposedCombination();
                blacks[attempt] = getBlacks(secret, proposedCombinations[attempt]);
                whites[attempt] = getWhites(secret, proposedCombinations[attempt]);
            }
            isWinner = blacks[attempt] === COMBINATION_LENGTH;
        } while (hasAttempts && !isWinner);
        writeResult(isWinner, secret);

        function getSecret() {
            let secretColors = [];
            do {
                const randomColor = COLORS[randomIntFromInterval(0, COLORS.length - 1)];
                let isIncluded = false;
                for (let i = 0; !isIncluded && i < secretColors.length; i++) {
                    isIncluded = secretColors[i] === randomColor;
                }
                if (!isIncluded) {
                    secretColors[secretColors.length] = randomColor;
                }
            } while (secretColors.length < COMBINATION_LENGTH);
            shuffleArray(secretColors, 1000);
            let secret = '';
            for (const color of secretColors) {
                secret += color;
            }
            return secret;

            function shuffleArray(array, iterations) {
                for (let i = 0; i < iterations; i++) {
                    const a = randomIntFromInterval(0, COMBINATION_LENGTH - 1);
                    const b = randomIntFromInterval(0, COMBINATION_LENGTH - 1);
                    const temp = array[a];
                    array[a] = array[b];
                    array[b] = temp;
                }
            }
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
        }
        function writeBoard(secret, proposedCombinations, blacks, whites, attempt) {
            console.writeln(`\n${attempt} attempt(s):`);
            writeSecret(secret);
            for (let i = 0; i < proposedCombinations.length; i++) {
                console.writeln(`${proposedCombinations[i]} --> ${blacks[i]} blacks and ${whites[i]} whites`);
            }

            function writeSecret(secret, isHidden = true) {
                const HIDDEN_CHAR = '*';
                let msg = '';
                for (const color of secret) {
                    msg += isHidden ? HIDDEN_CHAR : color;
                }
                console.writeln(msg);
            }
        }
        function readProposedCombination() {
            let combination;
            let error;
            do {
                combination = console.readString(`Propose a combination (${COLORS}): `);
                error = isValidCombination(combination);
                if (error !== '') {
                    console.writeln(error);
                }
            } while (error !== '');
            return combination;

            function isValidCombination(combination) {
                if (combination.length !== COMBINATION_LENGTH) {
                    return `Wrong length, it must be ${COMBINATION_LENGTH}`;
                }
                let isValid = true;
                for (let i = 0; isValid && i < combination.length; i++) {
                    isValid = isColorValid(combination[i]);
                }
                return isValid ? '' : `Wrong colors, they must be: ${COLORS}`;

                function isColorValid(color) {
                    let isValid = false;
                    for (let i = 0; !isValid && i < COLORS.length; i++) {
                        isValid = color === COLORS[i];
                    }
                    return isValid;
                }
            }
        }
        function getBlacks(secret, proposedCombination) {
            let blacks = 0;
            for (let i = 0; i < secret.length; i++) {
                if (proposedCombination[i] === secret[i]) {
                    blacks++;
                }
            }
            return blacks;
        }
        function getWhites(secret, proposedCombination) {
            let whites = 0;
            for (let i = 0; i < secret.length; i++) {
                for (let j = 0; j < proposedCombination.length; j++) {
                    if (i !== j && secret[i] === proposedCombination[j]) {
                        whites++;
                    }
                }
            }
            return whites;
        }
        function hasAvailableAttempts(attempt) {
            const MAX_ATTEMPTS = 10;
            return attempt < MAX_ATTEMPTS;
        }
        function writeResult(isWinner, secret) {
            let msg = `You've lost!!! :-(\nSecret: ${secret}`;
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
