// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NGORegistry {
    struct NGO {
        address ngoAddress;
        string name;
        string description;
        string phone;
        string location;
        string website;
        bool listed;
    }

    mapping(address => NGO) public ngos;
    address[] public ngoList;

    event NGOListed(
        address indexed ngo,
        string name,
        string phone,
        string location,
        string website
    );

    function listAsNGO(
        string memory _name,
        string memory _description,
        string memory _phone,
        string memory _location,
        string memory _website
    ) external {
        require(!ngos[msg.sender].listed, "Already listed as NGO");

        ngos[msg.sender] = NGO({
            ngoAddress: msg.sender,
            name: _name,
            description: _description,
            phone: _phone,
            location: _location,
            website: _website,
            listed: true
        });

        ngoList.push(msg.sender);

        emit NGOListed(msg.sender, _name, _phone, _location, _website);
    }

    function getAllNGOs() external view returns (NGO[] memory) {
        NGO[] memory all = new NGO[](ngoList.length);
        for (uint i = 0; i < ngoList.length; i++) {
            all[i] = ngos[ngoList[i]];
        }
        return all;
    }

    function isRegistered(address _ngo) external view returns (bool) {
        return ngos[_ngo].listed;
    }

    //Buy BREAD logic

    address public owner;
    uint256 public constant BREAD_PRICE_WEI = 540000000000000; // 0.00054 ETH in Wei

    mapping(address => uint256) public breadBalances;

    event BreadBought(address indexed buyer, uint256 amount, uint256 totalPaid);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //function to buy bread
    function buyBread(uint256 quantity) external payable {
        require(quantity > 0, "Quantity must be greater than 0.");
        uint256 totalCost = BREAD_PRICE_WEI * quantity;
        require(msg.value >= totalCost, "Insufficient Ether sent.");

        //Total breads owned
        breadBalances[msg.sender] += quantity;

        emit BreadBought(msg.sender, quantity, msg.value);

        // Refund extra Ether sent
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    //Raise Request
    struct Request {
        uint256 id;
        address ngo;
        string beneficiary;
        string category;
        string description;
        uint256 breadRequired;
        uint256 breadReceived;
        bool fulfilled;
    }

    uint256 public nextRequestId;
    mapping(uint256 => Request) public requests;
    mapping(address => uint256[]) public ngoToRequests;

    event RequestRaised(
        uint256 id,
        address indexed ngo,
        string beneficiary,
        string category,
        string description,
        uint256 breadRequired
    );

    event Donated(
        address indexed donor,
        uint256 indexed requestId,
        uint256 amount
    );

    // Function to raise a new donation request
    function raiseRequest(
        string memory _beneficiary,
        string memory _category,
        string memory _description,
        uint256 _breadRequired
    ) external {
        require(
            ngos[msg.sender].listed,
            "Only listed NGOs can raise requests."
        );
        require(_breadRequired > 0, "Bread required must be greater than 0");

        requests[nextRequestId] = Request({
            id: nextRequestId,
            ngo: msg.sender,
            beneficiary: _beneficiary,
            category: _category,
            description: _description,
            breadRequired: _breadRequired,
            breadReceived: 0,
            fulfilled: false
        });

        ngoToRequests[msg.sender].push(nextRequestId);

        emit RequestRaised(
            nextRequestId,
            msg.sender,
            _beneficiary,
            _category,
            _description,
            _breadRequired
        );

        nextRequestId++;
    }

    // Function to donate BREAD to a request
    function donateBread(uint256 _requestId, uint256 _amount) external {
        require(_amount > 0, "Must donate at least 1 BREAD.");
        require(breadBalances[msg.sender] >= _amount, "Not enough BREAD.");
        Request storage req = requests[_requestId];
        require(!req.fulfilled, "Request already fulfilled.");

        uint256 breadToDonate = _amount;
        if (req.breadReceived + _amount >= req.breadRequired) {
            breadToDonate = req.breadRequired - req.breadReceived;
            req.fulfilled = true;
        }

        breadBalances[msg.sender] -= breadToDonate;
        req.breadReceived += breadToDonate;
        breadBalances[req.ngo] += breadToDonate;
        req.breadRequired -= breadToDonate;

        emit Donated(msg.sender, _requestId, breadToDonate);
    }

    // View function to get all requests of an NGO
    function getRequestsByNGO(
        address _ngo
    ) external view returns (uint256[] memory) {
        return ngoToRequests[_ngo];
    }
    function getAllRequests() external view returns (Request[] memory) {
        Request[] memory all = new Request[](nextRequestId);
        for (uint i = 0; i < nextRequestId; i++) {
            all[i] = requests[i];
        }
        return all;
    }
    function getRequestDetails(
        uint256 _id
    )
        external
        view
        returns (
            address ngo,
            string memory beneficiary,
            string memory category,
            string memory description,
            uint256 breadRequired,
            uint256 breadReceived,
            bool fulfilled
        )
    {
        Request memory r = requests[_id];
        return (
            r.ngo,
            r.beneficiary,
            r.category,
            r.description,
            r.breadRequired,
            r.breadReceived,
            r.fulfilled
        );
    }
}
