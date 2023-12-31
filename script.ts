const zxcvbn = require('zxcvbn');
window.addEventListener('load', function () {
    displayGeneratedPassphrase();
    const generateBtn = document.querySelector('.generate');
    const generatedPassphraseField = document.querySelector('input');
    const crackTime = document.querySelector('.crack-time');
    let charactersRemaining: number = 16;

    async function fetchWordList(numberOfWords: number): Promise<string[]> {
        const res = await fetch(
            `https://random-word-api.vercel.app/api?words=${numberOfWords}&type=capitalized`
        );
        const wordList: string[] = await res.json();

        return wordList;
    }

    async function getRandomWord(wordList: string[]): Promise<string> {
        const randomIndex = Math.floor(Math.random() * wordList.length - 1);

        return wordList[randomIndex];
    }

    function pruneWordList(wordList: string[]): string[] {
        const prunedWordList: string[] = [];

        for (let i = 0; i < wordList.length; i++) {
            const word = wordList[i];
            if (word.length <= charactersRemaining) {
                prunedWordList.push(word);
            }
        }

        return prunedWordList;
    }

    function generateRandomNumber(): number {
        return Math.floor(Math.random() * 10);
    }

    function shuffleString(word: string): string {
        let chars: string[] = word.split('');
        let currentIndex: number = chars.length,
            randomIndex: number;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [chars[currentIndex], chars[randomIndex]] = [
                chars[randomIndex],
                chars[currentIndex],
            ];
        }

        return chars.join('');
    }

    function generateSpecialCharacter(): string {
        let specialCharacters: string = '!@#$%%^^^&&&&***-_=+?';
        return specialCharacters.charAt(
            Math.floor(Math.random() * specialCharacters.length)
        );
    }

    function generateNumberOrSpecialCharacter(): string {
        const randomNum: number = Math.floor(Math.random() * 5);
        return randomNum === 0
            ? generateRandomNumber().toString()
            : generateSpecialCharacter();
    }

    async function generateRandomPassphrase(): Promise<string> {
        let passphrase: string = '';
        let wordList: string[] = await fetchWordList(500);

        while (charactersRemaining > 0 && wordList.length > 0) {
            let word: string = await getRandomWord(wordList);
            if (word) {
                const randomIndex: number =
                    Math.floor(Math.random() * (word.length - 1)) + 1;
                const letters: string[] = word.split('');
                letters[randomIndex] = letters[randomIndex].toUpperCase();
                word = letters.join('');
                passphrase += word;
                charactersRemaining -= word.length;
            }

            // Maximum of 3 character sequence
            const maxNumAndSpecialCharLength: number = Math.min(
                charactersRemaining,
                3
            );

            const numAndSpecialCharLength: number = Math.min(
                charactersRemaining,
                Math.floor(
                    Math.random() * (maxNumAndSpecialCharLength - 3 + 1)
                ) + 3
            );

            for (let i = 0; i < numAndSpecialCharLength; i++) {
                passphrase += generateNumberOrSpecialCharacter();
                charactersRemaining--;
            }

            wordList = pruneWordList(wordList);
        }

        if (passphrase.length < 16 && charactersRemaining > 0) {
            for (let i = 0; i < charactersRemaining; i++) {
                passphrase += generateNumberOrSpecialCharacter();
                charactersRemaining--;
            }
        }

        if (!passphraseIsValid(passphrase)) {
            charactersRemaining = 16;
            return generateRandomPassphrase(); // Regenerate passphrase if it's invalid
        }

        return passphrase;
    }

    function passphraseIsValid(passphrase: string): boolean {
        return (
            containsNumbers(passphrase) &&
            containsSpecialCharacters(passphrase) &&
            passphrase.length >= 10 &&
            passphrase.length <= 16
        );
    }

    function containsNumbers(passphrase: string): boolean {
        return /[0-9]/.test(passphrase);
    }

    function containsSpecialCharacters(passphrase: string): boolean {
        return /[!@#$%^&*\-_=+?]/.test(passphrase);
    }

    async function displayGeneratedPassphrase() {
        const passphrase: string = await generateRandomPassphrase();
        const timeToCrack: string =
            zxcvbn(
                passphrase
            ).crack_times_display.offline_slow_hashing_1e4_per_second.toString();
        crackTime.innerHTML = `${timeToCrack}`;
        generatedPassphraseField.value = passphrase;
    }

    generateBtn.addEventListener('click', async function () {
        displayGeneratedPassphrase();
        charactersRemaining = 16;
    });
});
