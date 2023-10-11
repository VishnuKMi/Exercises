// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Crowdfunding {

    mapping(address => uint) public contributors; //a local memory for every contributors
    address public manager;
    uint public targetFund;
    uint public deadline;
    uint public minContribution;
    uint public raisedAmount;
    uint public noOfContributors;

    struct Request {
        string description;
        address payable recipient; //acc to which funding is done
        uint value;
        bool completed;
        uint noOfVoters; //voters/contributers deciding 50% majority on requests.
        mapping(address => bool) voters;
    }

    mapping(uint => Request) public requests; //The so collected funds can be distributed upon different requests of Manager's need and
    uint public numRequests; //we keep track of it here (Increment won't help in mapping as it does it arrays) (charity, vaccine, business...)

    constructor(uint _targetFund, uint _deadline) {
        manager = msg.sender;
        targetFund = _targetFund;
        deadline = block.timestamp + _deadline;
        minContribution = 100 wei;
    } 

    function sendEth() public payable {
        require(block.timestamp < deadline, "Deadline met, Sorry!");
        require(msg.value >= minContribution, "Minimum Contribution hasn't met");

        if(contributors[msg.sender] == 0) { //when contributor hasn't contributed yet.
            noOfContributors++;
        }
        contributors[msg.sender] += msg.value; // when same person again intends to donate more, then "if" block fails and 
        raisedAmount += msg.value; // it wont increment as a new donor. Instead just keeps track of latest amount added.
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function reFund() public {
        require(block.timestamp > deadline, "NOT eligible for refund. Deadline not met yet!"); // require(block.timestamp > deadline && raisedAmount < targetFund)
        require(raisedAmount < targetFund, "NOT eligible for refund. Project has acquired Targeted fund!");
        require(contributors[msg.sender] > 0, "Contribute first 0_0");

        address payable user = payable(msg.sender); //explicitly making the "refund caller/msg.sender" payable.
        user.transfer(contributors[msg.sender]);
        contributors[msg.sender] = 0;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only Manager can call this function");
        _;
    }

    function createRequests(string memory _description, address payable _recipient, uint _value) public onlyManager {
        Request storage newRequest = requests[numRequests]; //creating new struct var
        numRequests++;

        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.noOfVoters = 0;
    }

    function voteRequest(uint _reqIndex) public {
        require(contributors[msg.sender] > 0, "You must be a contributor to vote :/");
        Request storage thisRequest = requests[_reqIndex]; //points to the index (in mapped storage) as we input.
        
        require(thisRequest.voters[msg.sender] == false, "You have already voted!");
        thisRequest.voters[msg.sender] == true;
        thisRequest.noOfVoters++;

    }

    function makePayment(uint _reqIndex) public onlyManager { //func to make payment of req in specific index.
        require(raisedAmount >= targetFund);
        Request storage thisRequest = requests[_reqIndex];
        require(thisRequest.completed == false, "This request has been completed");
        require(thisRequest.noOfVoters > noOfContributors/2, "Majority doesn't support :("); //to make payment, more than 50% of contributors should vote.
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed == true; //check converts from false to true as state change.
    }

}
