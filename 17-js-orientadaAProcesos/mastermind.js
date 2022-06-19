const { Console } = require('console-mpds');
const console = new Console();

playMastermind();

function playMastermind() {
    do {
        playGame();
    } while (isResumed());

    function playGame() {
        const game = initGame();
        console.writeln('----- MASTERMIND -----');
        writeGame(game);
        do {
            readProposedCombination(game);
            writeGame(game);
        } while (!isGameOver(game) && !isWinner(game));
        writeResult(game);

        function initGame() {
            const game = {
                MAX_ATTEMPTS: 10,
                COMBINATION_LENGTH: 4,
                VALID_COLORS: ['r', 'g', 'b', 'y', 'c', 'm'],
                proposedCombinations: [],
                secretCombination: ''
            };
            setSecretCombination(game);
            return game;

            function setSecretCombination(game) {
                let secretColors = getRandomColors(game);
                const SHUFFLE_ITERATIONS = 1000;
                shuffleArray(secretColors, SHUFFLE_ITERATIONS);
                let secret = '';
                for (const color of secretColors) {
                    secret += color;
                }
                game.secretCombination = secret;

                function getRandomColors(game) {
                    let randomColors = [];
                    do {
                        const randomColor = game.VALID_COLORS[getRandomIndex(game.VALID_COLORS)];
                        if (!arrayIncludes(randomColors, randomColor)) {
                            randomColors[randomColors.length] = randomColor;
                        }
                    } while (randomColors.length < game.COMBINATION_LENGTH);
                    return randomColors;
                }
                function shuffleArray(array, iterations) {
                    for (let i = 0; i < iterations; i++) {
                        const a = getRandomIndex(array);
                        const b = getRandomIndex(array);
                        const temp = array[a];
                        array[a] = array[b];
                        array[b] = temp;
                    }
                }
                function getRandomIndex(array) {
                    return parseInt(Math.random() * array.length);
                }
            }
        }
        function writeGame(game) {
            console.writeln(`\n${game.proposedCombinations.length} attempt(s):`);
            writeSecretCombination(game);
            for (const proposedCombination of game.proposedCombinations) {
                const { combination, blacks, whites } = proposedCombination;
                console.writeln(`${combination} --> ${blacks} blacks and ${whites} whites`);
            }

            function writeSecretCombination(game) {
                const HIDDEN_CHAR = '*';
                const isHidden = !isGameOver(game);
                let msg = '';
                for (const color of game.secretCombination) {
                    msg += isHidden ? HIDDEN_CHAR : color;
                }
                console.writeln(msg);
            }
        }
        function readProposedCombination(game) {
            let combination;
            let error;
            do {
                combination = console.readString(`Propose a combination (${game.VALID_COLORS}): `);
                error = validateCombination(combination, game);
                if (error !== '') {
                    console.writeln(error);
                }
            } while (error !== '');
            game.proposedCombinations[game.proposedCombinations.length] = {
                combination,
                blacks: getBlacks(game.secretCombination, combination),
                whites: getWhites(game.secretCombination, combination)
            };

            function validateCombination(combination, game) {
                if (combination.length !== game.COMBINATION_LENGTH) {
                    return `Wrong length, it must be ${game.COMBINATION_LENGTH}`;
                }
                if (!areValidColors(game.VALID_COLORS, combination)) {
                    return `Wrong colors, they must be: ${game.VALID_COLORS}`;
                }
                return '';

                function areValidColors(validColors, combination) {
                    for (const color of combination) {
                        if (!arrayIncludes(validColors, color)) {
                            return false;
                        }
                    }
                    return true;
                }
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
        function isGameOver(game) {
            return game.proposedCombinations.length >= game.MAX_ATTEMPTS;
        }
        function writeResult(game) {
            let msg = `You've lost!!! :-(`;
            if (isWinner(game)) {
                msg = `You've won!!! ;-)`;
            }
            console.writeln(msg);
        }
        function isWinner(game) {
            return (
                game.secretCombination === game.proposedCombinations[game.proposedCombinations.length - 1].combination
            );
        }
    }
    function isResumed() {
        const VALID_RESPONSES = ['y', 'Y', 'n', 'N'];
        let response;
        do {
            response = console.readString('Do you want to continue? (y/n):');
        } while (!arrayIncludes(VALID_RESPONSES, response));
        return response === 'Y' || response === 'y';
    }
    function arrayIncludes(array, searchItem) {
        for (const item of array) {
            if (item === searchItem) {
                return true;
            }
        }
        return false;
    }
}
