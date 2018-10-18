const Vote = artifacts.require("../contracts/Vote.sol")
const MyVerifiy = artifacts.require("../contracts/MyVerify.sol")

contract("Vote",(accounts) => {    

    beforeEach(async () => {
        contractInstance = await Vote.deployed()
        organizer = await accounts[0]
        voter = await accounts[1]
        inspector = await accounts[2]
    })

    it("voter can send vote to organizer",async() => {

        const voteId = await 0

        // create vote
        const hash = await web3.sha3("0x11")
        await contractInstance.setVoterAddr(voter,{from:organizer});
        const tx1 = await contractInstance.createVote(hash,{from:voter});
        assert.isOk(tx1)

        // sign by organizer
        const organizer_sig = await web3.eth.sign(organizer,hash)
        const tx2 = await contractInstance.signByOrganizer(voteId,organizer_sig,{from:organizer})
        assert.isOk(tx2)

        // sign by inspector
        const tx3 = await contractInstance.setInspectorAddr(inspector,{from:organizer})
        assert.isOk(tx3)
        const inspector_sig = await web3.eth.sign(inspector,hash)
        const tx4 = await contractInstance.signByInspector(0,inspector_sig,{from:inspector}) 
        assert.isOk(tx4)

        // const test = await contractInstance.votes(voteId)
        // console.log(test)

        // send vote to organizer
        const mypkv = "0x11"
        const tx5 = contractInstance.sendToOrganizer(mypkv,0,{from:voter})
        assert.isOk(tx5)
       
    })

    it("only voter can vote",async() => {
        const voteId = await 0

        // create vote
        const hash = await web3.sha3("0x11")
        await contractInstance.setVoterAddr(voter,{from:organizer});
        const tx1 = await contractInstance.createVote(hash,{from:voter});
        assert.isOk(tx1)

        // sign by organizer
        const organizer_sig = await web3.eth.sign(organizer,hash)
        const tx2 = await contractInstance.signByOrganizer(voteId,organizer_sig,{from:organizer})
        assert.isOk(tx2)

        // sign by inspector
        const tx3 = await contractInstance.setInspectorAddr(inspector,{from:organizer})
        assert.isOk(tx3)
        const inspector_sig = await web3.eth.sign(inspector,hash)
        const tx4 = await contractInstance.signByInspector(0,inspector_sig,{from:inspector}) 
        assert.isOk(tx4)

        // send vote to organizer
        const mypkv = "0x11"

        try{
            await contractInstance.sendToOrganizer(mypkv,0,{from:voter})
            assert.ok(false,"The contract should reject this case")
        }catch(error){
            assert.ok(true,"The contract is not allowing external users to send vote ")
        }        
    })

    it("organizer can set result",async() => {
        const voteId = await 0

        // create vote
        const hash = await web3.sha3("0x11")
        await contractInstance.setVoterAddr(voter,{from:organizer});
        const tx1 = await contractInstance.createVote(hash,{from:voter});
        assert.isOk(tx1)

        // sign by organizer
        const organizer_sig = await web3.eth.sign(organizer,hash)
        const tx2 = await contractInstance.signByOrganizer(voteId,organizer_sig,{from:organizer})
        assert.isOk(tx2)

        // sign by inspector
        const tx3 = await contractInstance.setInspectorAddr(inspector,{from:organizer})
        assert.isOk(tx3)
        const inspector_sig = await web3.eth.sign(inspector,hash)
        const tx4 = await contractInstance.signByInspector(0,inspector_sig,{from:inspector}) 
        assert.isOk(tx4)

        const candidateId = 1;

        const tx5 = await contractInstance.voteToCandidate(voter,candidateId,{from:organizer})
        assert.isOk(tx5)

        // const test = await contractInstance.votes(voteId)
        // console.log(test)
    })

    it("only organizer set result of voting",async() => {
        const voteId = await 0

        // create vote
        const hash = await web3.sha3("0x11")
        await contractInstance.setVoterAddr(voter,{from:organizer});
        const tx1 = await contractInstance.createVote(hash,{from:voter});
        assert.isOk(tx1)

        // sign by organizer
        const organizer_sig = await web3.eth.sign(organizer,hash)
        const tx2 = await contractInstance.signByOrganizer(voteId,organizer_sig,{from:organizer})
        assert.isOk(tx2)

        // sign by inspector
        const tx3 = await contractInstance.setInspectorAddr(inspector,{from:organizer})
        assert.isOk(tx3)
        const inspector_sig = await web3.eth.sign(inspector,hash)
        const tx4 = await contractInstance.signByInspector(0,inspector_sig,{from:inspector}) 
        assert.isOk(tx4)

        try{
            await contractInstance.voteToCandidate(mypkv,0,{from:voter})
            assert.ok(false,"The contract should reject this case")
        }catch(error){
            assert.ok(true,"The contract is not allowing external users to send vote ")
        }     
        // const test = await contractInstance.votes(voteId)
        // console.log(test)
    })

    it("can count vote",async() => {
        const voteId = await 0

        // create vote
        const hash = await web3.sha3("0x11")
        await contractInstance.setVoterAddr(voter,{from:organizer});
        const tx1 = await contractInstance.createVote(hash,{from:voter});
        assert.isOk(tx1)

        // sign by organizer
        const organizer_sig = await web3.eth.sign(organizer,hash)
        const tx2 = await contractInstance.signByOrganizer(voteId,organizer_sig,{from:organizer})
        assert.isOk(tx2)

        // sign by inspector
        const tx3 = await contractInstance.setInspectorAddr(inspector,{from:organizer})
        assert.isOk(tx3)
        const inspector_sig = await web3.eth.sign(inspector,hash)
        const tx4 = await contractInstance.signByInspector(0,inspector_sig,{from:inspector}) 
        assert.isOk(tx4)

        //vote
        const candidateId = await 1;
        const tx5 = await contractInstance.voteToCandidate(voter,candidateId,{from:organizer})
        assert.isOk(tx5)

        //view result
        //const result = await contractInstance.addressToResult(voter)
        //const resulttest = await result.toNumber()
        //console.log(resulttest)
        const tx6 = await contractInstance.viewResult(voter,{from:organizer}).call()
        console.log(tx6)
        //TODO: assert.equalでの確認
        assert.isOk(tx6)

        // const test = await contractInstance.votes(voteId)
        // console.log(test)
    })

    it("anyone can count vote",async() => {
        const voteId = await 0

        // create vote
        const hash = await web3.sha3("0x11")
        await contractInstance.setVoterAddr(voter,{from:organizer});
        const tx1 = await contractInstance.createVote(hash,{from:voter});
        assert.isOk(tx1)

        // sign by organizer
        const organizer_sig = await web3.eth.sign(organizer,hash)
        const tx2 = await contractInstance.signByOrganizer(voteId,organizer_sig,{from:organizer})
        assert.isOk(tx2)

        // sign by inspector
        const tx3 = await contractInstance.setInspectorAddr(inspector,{from:organizer})
        assert.isOk(tx3)
        const inspector_sig = await web3.eth.sign(inspector,hash)
        const tx4 = await contractInstance.signByInspector(0,inspector_sig,{from:inspector}) 
        assert.isOk(tx4)

        //vote
        const candidateId = await 1;
        const tx5 = await contractInstance.voteToCandidate(voter,candidateId,{from:organizer})
        assert.isOk(tx5)

        //view result
        //const result = await contractInstance.addressToResult(voter)
        //const resulttest = await result.toNumber()
        //console.log(resulttest)
        const tx6 = await contractInstance.viewResult(voter,{from:voter}) // from : voter
        console.log(tx6)
        //TODO: assert.equalでの確認,call()で呼べないというか引数を持つ値はどうやって見るのか
        assert.isOk(tx6)

        // const test = await contractInstance.votes(voteId)
        // console.log(test)
        // const test = await contractInstance.votes(voteId)
        // console.log(test)
    })

})