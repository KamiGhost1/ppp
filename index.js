const wordlist = require('./wordlist')
const CryptoJS = require('crypto-js')


let ppp = function ppp(){

    function sha(str){
        return CryptoJS.SHA256(str).toString()
    }

    this.wordlist = ()=>{
        return wordlist
    }

    let decGx = [299]

    function generate(array){
        if(typeof array !== 'object'){
            return false
        }
        let hashSum = '';
        for(let i in array){
            hashSum = sha(hashSum+array[i]);
        }
        hashSum = crc(hashSum,decGx[0])
        let seed = getSeedPhrase(hashSum)
        return {privateKey:hashSum, seed}
    }

    function getSeedPhrase(hash, size = 11){
        let bin = decToBin(hexToDec(hash))
        let ptr = '';
        let words = []
        let num = 0;
        bin = sliceBin(bin, size)
        num = binToDec(bin)
        // console.log(num)
        for(let i in num){
            words.push(wordlist[num[i]])
        }
        return words
    }

    function crc(hash,gx){
        if(typeof gx === 'number'){
            gx = gx.toString(2)
            // console.log(gx)
            // return true
        }
        a = decToBin(hexToDec(hash))
        for(let i = 0;i<gx.length-1;i++){
            a+='0'
        }
        let b = division(a, gx)
        b = decToHex(binToDec([b]))
        hash+=b
        return hash
    }

    function division(hash, gx){
        // console.log('start ',hash)
        let msg = hash
        msg = msg.split('')
        let size_j = 0;
        let key = 0;
        if(msg.length<gx.length){
            return false
        }else {
            for(let i =0;i<hash.length-(gx.length -1);i++){
                size_j = i + gx.length
                if(msg[i] === '0'){
                    continue
                }else{
                    // console.log('start div module ', msg.slice(i,size_j))
                    for(let j = i;j<size_j;j++){
                        if(msg[j]===gx[key]){
                            // console.log(j,0)
                            msg[j] = '0'
                        }else{
                            // console.log(j,1)
                            msg[j]='1';
                        }
                        key++;
                    }
                    key = 0;
                }
            }
            return msg.join('')
        }
    }

    function decToBin(num, size= 8){
        let binStr = '';
        let deg = 0
        let ptr = '';
        for(let i = 0;i<num.length; i++){
            deg = degNumSize(num[i])
            ptr = num[i].toString(2)
            if(deg<size){
                for(deg;deg<size;deg++){
                    ptr= '0'+ptr
                }
            }
            binStr +=ptr
        }
        return binStr
    }

    function binToDec(binMass){
        let decMass = []
        for(let i = 0; i<binMass.length;i++){
            decMass.push(parseInt(binMass[i],2))
        }
        return decMass
    }
    function binToHex(binMass){
        let hexMass = []
        for(let i = 0; i<binMass.length;i++){
            hexMass.push((parseInt(binMass[i],2)).toString(16))
        }
        return hexMass
    }

    function decToHex(num, size = 2){
        let hexStr =''
        let ptr = '';
        let deg = 0
        for(let i = 0;i<num.length; i++){
            ptr = num[i].toString(16)
            if(ptr.length<size){
                ptr= '0'+ptr
            }
            hexStr +=ptr
        }
        return hexStr
    }


    function hexToDec(hash, size = 2){
        let decMass = []
        let byte = ''
        for(let i =0;i<hash.length/size;i++){
            byte = hash[i*size] + hash[i*size+1]
            decMass.push(parseInt(byte,16))
        }
        return decMass
    }

    function degNum(num){
        if(num > 0)
            return Math.floor(Math.log2(num));
        else
            return 0
    }

    function degNumSize(num){
        if(num > 0)
            return Math.floor(Math.log2(num)) +1;
        else
            return 1
    }

    function sliceBin(bin, size=8){
        let binMass = []
        let slice = ''
        for(let i = 0;i<bin.length/size;i++){
            slice = bin.slice(i*size,i*size+size)
            binMass.push(slice)
        }
        return binMass
    }

    this.main = {
        generate,
        crc,
        division,
        getSeedPhrase
    }
    this.utils = {
        degNum,
        degNumSize,
        decToHex,
        decToBin,
        binToDec,
        binToHex,
        hexToDec,
        sliceBin
    }
}

let a = new ppp()


module.exports = new ppp()