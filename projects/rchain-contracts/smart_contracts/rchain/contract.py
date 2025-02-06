from algopy import ARC4Contract, Account, String, UInt64, Asset, BoxMap
from algopy.arc4 import abimethod
from algopy import *


class Recipient(arc4.Struct):

        wallet: arc4.Address
        funding_left: arc4.UInt64
        # self.wallet = wallet        # address of the recipient
        # self.funding_left = funding_left # the amount of funding they are supposed to receive

class Rchain(ARC4Contract):

    # next_token_id: UInt64
    distribution_percentage: UInt64
    last_distribution_time: UInt64
    distribution_interval: UInt64
    total_amount_left: UInt64
    # emergency_stop: Boolzx
    usdt_asset_id: Asset
    Bronze_id: Asset    #   bronze nft 
    Silver_id: Asset    #   silver nft 
    Gold_id: Asset      #  gold nft 
    recipient: Account
    recipient_funding_left: UInt64



    # class Tier:
    #     BRONZE = 0
    #     SILVER = 1
    #     GOLD = 2

    # def __init__(self) -> None:
    #     recipients = BoxMap(UInt64, Account)

        # self.token_tiers:  = {}
        # self.token_owners = {}

    @abimethod()
    def initialise(self, usdt_id: Asset, distribution_interval: UInt64, total_amount_to_raise: UInt64, Recipient: Account, bronze_id: Asset, silver_id: Asset, gold_id: Asset, Recipient_funding_left: UInt64) -> None: 
        self.distribution_percentage = UInt64(70)
        self.last_distribution_time = Global.latest_timestamp
        self.total_amount_left = total_amount_to_raise
        self.distribution_interval = distribution_interval
        self.recipient = Recipient       
        self.usdt_asset_id = usdt_id
        self.Bronze_id = bronze_id
        self.Silver_id = silver_id
        self.Gold_id = gold_id
        self.recipient_funding_left = Recipient_funding_left

    @abimethod()
    def opt_in_to_asset(self, mbrpay: gtxn.PaymentTransaction) -> None:
        assert Txn.sender == Global.creator_address
        # assert not Global.current_application_address.is_opted_in(self.Bronze_id)
        # assert not Global.current_application_address.is_opted_in(self.Silver_id)
        # assert not Global.current_application_address.is_opted_in(self.Gold_id)

        

        assert mbrpay.receiver == Global.current_application_address

        # assert mbrpay.amount == Global.min_balance + Global.asset_opt_in_min_balance*UInt64(3)
        itxn.AssetConfig(
            total= 100,
            unit_name= "Tex",
            asset_name="Demo",
            decimals=0
        ).submit()



        itxn.AssetTransfer(
            xfer_asset= self.Bronze_id,
            asset_receiver= Global.current_application_address,
            asset_amount= 0,
            asset_sender= Txn.sender
        ).submit()

        itxn.AssetTransfer(
            xfer_asset= self.Silver_id,
            asset_receiver= Global.current_application_address,
            asset_amount= 0,
            asset_sender= Txn.sender
        ).submit()

        itxn.AssetTransfer(
            xfer_asset= self.Gold_id,
            asset_receiver= Global.current_application_address,
            asset_amount= 0,
            asset_sender= Txn.sender
        ).submit()

        

    
    @abimethod()
    def buyAndMint(self, amount_sent: UInt64, payment: gtxn.PaymentTransaction) -> None:      # mints an sbt after the transaction is done
        assert payment.sender == Txn.sender
        assert payment.receiver == Global.current_application_address, "not sent to this address"
        assert payment.amount == amount_sent, "amount sent is not correct"
        assert payment.amount >= 200, "Minimum amount to send is 200USD" 

        if payment.amount < UInt64(1_000_000): 
            assert self.Bronze_id.balance(Global.caller_application_address), "Out of bronze SBTs"
            assetToTransfer = self.Bronze_id
        elif payment.amount < UInt64(3_000_000):  
            assert self.Silver_id.balance(Global.caller_application_address), "Out of Silver SBTs"
            assetToTransfer = self.Silver_id
        else:
            assert self.Gold_id.balance(Global.caller_application_address)  > 0, "Out of gold SBTs"
            assetToTransfer = self.Gold_id

        # should mint the asset[nft]  to the sender's address will figure this out later
        itxn.AssetTransfer(     
            xfer_asset= assetToTransfer,     # id of the nft
            asset_receiver= Txn.sender,  
            asset_amount= 1,
        ).submit() 




    @abimethod()
    def AllocateFunds(self, recipient: Account) -> None: 
        assert (Global.latest_timestamp >= self.last_distribution_time + self.distribution_interval), "distribution interval not reached"
        # assert len(self.recipient), "No recipients in the list"    

        # poolBalance = Global.current_application_address.    
        poolBalance = self.usdt_asset_id.balance(Global.caller_application_address) # check the usdt balance of the pool
        assert poolBalance > 0  

        distribution_amount: UInt64 = (poolBalance * self.distribution_percentage) // 100

         
        # recipient_share = (distribution_amount * self.recipient_funding_left) // self.total_amount_left
        itxn.AssetTransfer(
            xfer_asset= self.usdt_asset_id,
            asset_receiver= recipient,
            asset_amount= distribution_amount,
        ).submit() 
        self.recipient_funding_left -= distribution_amount

        self.last_distribution_time = Global.latest_timestamp
        self.total_amount_left -= distribution_amount