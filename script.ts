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
            if (word.length < charactersRemaining) {
                prunedWordList.push(word);
            }
        }

        return prunedWordList;
    }

    function generateRandomNumber(): number {
        return Math.floor(Math.random() * 10);
    }

    function generateSpecialCharacter(): string {
        const specialCharacters: string = '!@#$%^&*-_=+?';
        return specialCharacters.charAt(
            Math.floor(Math.random() * specialCharacters.length)
        );
    }

    function generateNumberOrSpecialCharacter(): string {
        const randomNum: number = Math.floor(Math.random() * 3);
        return randomNum === 0
            ? generateRandomNumber().toString()
            : generateSpecialCharacter();
    }

    async function generateRandomPassphrase(): Promise<string> {
        let passphrase: string = '';
        let wordList: string[] = await fetchWordList(500);

        while (charactersRemaining > 0 && wordList.length > 0) {
            const word: string = await getRandomWord(wordList);
            if (word) {
                passphrase += word;
                charactersRemaining -= word.length;
            }

            // Maximum of 5 character sequence
            const maxNumAndSpecialCharLength: number = Math.min(
                charactersRemaining,
                5
            );

            // Minimum of 2 character sequence
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

        if (!passphraseIsValid(passphrase)) {
            charactersRemaining = 16;
            return generateRandomPassphrase(); // Regenerate passphrase if it's invalid
        }

        if (passphrase.length < 16 && charactersRemaining > 0) {
            for (let i = 0; i <= charactersRemaining; i++) {
                passphrase += generateNumberOrSpecialCharacter();
                charactersRemaining--;
            }
        }

        return passphrase;
    }

    function passphraseIsValid(passphrase: string): boolean {
        return (
            containsNumbers(passphrase) &&
            containsSpecialCharacters(passphrase) &&
            passphrase.length >= 10
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
        console.log(passphrase.length);
    }

    generateBtn.addEventListener('click', async function () {
        displayGeneratedPassphrase();
        charactersRemaining = 16;
    });
});
