var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
window.addEventListener('load', function () {
    var generateBtn = document.querySelector('.generate');
    var generatedPassphraseField = document.querySelector('input');
    var charactersRemaining = 16;
    function fetchWordList(numberOfWords) {
        return __awaiter(this, void 0, void 0, function () {
            var res, wordList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://random-word-api.vercel.app/api?words=".concat(numberOfWords, "&type=capitalized"))];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        wordList = _a.sent();
                        return [2 /*return*/, wordList];
                }
            });
        });
    }
    function getRandomWord(wordList) {
        return __awaiter(this, void 0, void 0, function () {
            var randomIndex;
            return __generator(this, function (_a) {
                randomIndex = Math.floor(Math.random() * wordList.length - 1);
                return [2 /*return*/, wordList[randomIndex]];
            });
        });
    }
    function pruneWordList(wordList) {
        var prunedWordList = [];
        for (var i = 0; i < wordList.length; i++) {
            var word = wordList[i];
            if (word.length < charactersRemaining) {
                prunedWordList.push(word);
            }
        }
        return prunedWordList;
    }
    function generateRandomNumber() {
        return Math.floor(Math.random() * 10);
    }
    function generateSpecialCharacter() {
        var specialCharacters = '!@#$%^&*-_=+?';
        return specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
    }
    function generateNumberOrSpecialCharacter() {
        var randomNum = Math.floor(Math.random() * 2);
        return randomNum == 0
            ? generateRandomNumber().toString()
            : generateSpecialCharacter();
    }
    function generateRandomPassphrase() {
        return __awaiter(this, void 0, void 0, function () {
            var passphrase, wordList, word, maxNumAndSpecialCharLength, numAndSpecialCharLength, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passphrase = '';
                        return [4 /*yield*/, fetchWordList(500)];
                    case 1:
                        wordList = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(charactersRemaining > 0)) return [3 /*break*/, 4];
                        if (wordList.length === 0) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, getRandomWord(wordList)];
                    case 3:
                        word = _a.sent();
                        if (word) {
                            passphrase += word;
                            charactersRemaining -= word.length;
                        }
                        maxNumAndSpecialCharLength = Math.min(charactersRemaining, 3);
                        numAndSpecialCharLength = Math.floor(Math.random() * maxNumAndSpecialCharLength) + 1;
                        for (i = 0; i < numAndSpecialCharLength; i++) {
                            passphrase += generateNumberOrSpecialCharacter();
                            charactersRemaining--;
                        }
                        wordList = pruneWordList(wordList);
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, passphrase];
                }
            });
        });
    }
    function passphraseIsValid(passphrase) {
        return (containsNumbers(passphrase) &&
            containsSpecialCharacters(passphrase) &&
            passphrase.length >= 10 &&
            passphrase.length <= 16);
    }
    function containsNumbers(passphrase) {
        return /[0-9]/.test(passphrase);
    }
    function containsSpecialCharacters(passphrase) {
        return /[!@#$%^&*\-_=+?]/.test(passphrase);
    }
    generateBtn.addEventListener('click', function () {
        return __awaiter(this, void 0, void 0, function () {
            var passphrase;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, generateRandomPassphrase()];
                    case 1:
                        passphrase = _a.sent();
                        generatedPassphraseField.value = passphrase;
                        charactersRemaining = 16;
                        return [2 /*return*/];
                }
            });
        });
    });
});
