window.addEventListener('load', function () {
    const generateBtn = document.querySelector('.generate');
    const generatedPassphraseField = document.querySelector('input');

    async function fetchWordList(numberOfWords: number): Promise<string> {
        const res = await fetch(
            `https://random-word-api.vercel.app/api?words=${numberOfWords}&type=capitalized`
        );
        const randomWord: string = await res.json();

        return randomWord;
    }

    async function getRandomWord(): Promise<string> {
        const wordList = await fetchWordList(100);
        const randomIndex = Math.floor(Math.random() * wordList.length - 1);

        return wordList[randomIndex];
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
        const randomNum: number = Math.floor(Math.random() * 2);
        if (randomNum == 0) {
            return generateRandomNumber().toString();
        } else {
            return generateSpecialCharacter();
        }
    }

    async function generateRandomPassphrase(): Promise<string> {
        let charactersRemaining: number = 16;
        let passphrase: string = '';

        while (charactersRemaining > 0) {
            let word: string = await getRandomWord();
            passphrase += word;
            charactersRemaining -= word.length;

            // Maximum of 3 character sequence
            const maxNumAndSpecialCharLength: number = Math.min(
                charactersRemaining,
                3
            );

            const numAndSpecialCharLength: number =
                Math.floor(Math.random() * maxNumAndSpecialCharLength) + 1;

            for (let i = 0; i < numAndSpecialCharLength; i++) {
                passphrase += generateNumberOrSpecialCharacter();
                charactersRemaining--;
            }

            // Prune list
        }

        if (passphrase.length > 16) {
            passphrase = passphrase.slice(0, 16); // Slice the passphrase to fit within the limit
        }

        console.log(passphrase);

        return passphrase;
    }

    generateBtn.addEventListener('click', async function () {
        const passphrase: string = await generateRandomPassphrase();
        generatedPassphraseField.value = passphrase;
    });
});
