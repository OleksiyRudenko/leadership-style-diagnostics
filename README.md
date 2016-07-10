`[2016-08-07] - created`

# Workshop Landing Page

A Landing Page template for a workshop.

## Table of Contents

1. [The Process](#the-process)
1. [Application Structure](#application-structure)
    1. [Public Page](#public-page)
    1. [Management Page](#management-page)
1. [Data Model](#data-model)
    1. [Entities](#entities)
1. [Business Logic](#business-logic)
    1. [Public: Attendee Related Behaviour](#public-attendee-related-behaviour)
    1. [Public: Back-End Data Related Behaviour](#public-back-end-data-related-behaviour)
    1. [Private: Management](#private-management)

## The Process

### Overview

One may want to run a recurring 

[**[back-to-top](#table-of-contents)**]

### Definitions

**Individual**

In global context:
 * Attendee - prospect
 * Refugee - explicitly rejected any further communications; reset when registers to any Event
 * Speaker - speaker
 * Host - hosts events
 * Admin to a Host - administrates events

In context of Event:
 * Invitee - invited by host to visit landing page/registration
 * Subscriber - subscribed for event launch notice
 * Registered - registered while not paid yet
 * Attendee - admittance paid
 * Graduate - attended event
 * Rejector - rejected further notices at any stage. Reasons stored
 * Pending - didn't reject but `Z` reached before individual became attendee
 
`W` - absolute required minimum count(Attendees)
`X` - last call threshhold
`Y` - optimal count(Attendees)
`Z` - maximum count(Attendees)

[**[back-to-top](#table-of-contents)**]

### Conceptual Workflow Model

* Initialization
    - Define Host, Admin
    - Define re Event: topic and components, location(city), duration, 
        {`W`, `X`, `Y`, `Z`}, external resources (web-site, page on social network)
    - Add Invitees to the Event context
* Reveal interest
    - Define
    - Make a landing page (cover, targeting, modules, extras, testimonials/gallery, 
        {when,where,seats,price}.proposed, author, subscribe = subscribe.survey|surveyNotice)
        - Survey: contacts (name, email, telephone, city), checkbox (would attend in my city), date options
        - Survey form pre-populated with data from cookies/browser-input-history/email-url/DB
        - If user is Subscriber then subscribe.surveyNotice = thank you; click if you want to 
            change anything -> subscribe.survey; share
        - On submission: Invitee => Subscriber
    - Publish on social networks / venues sites 
    - Email invitations: url+clientid, discontinueThis, discontinueAll
    - Collect Subscribers
        - email confirmation: thank you, on city-mismatch -> discontinueThisCity
        - notify Host
* Promo Campaign
    - Define re Event: date and time, location, prices
    - Create event notices on social networks / venues sites
    - Update Landing Page: ... refs to public events, subscribe = subscribe.register
        - If isRegistered then subscribe = subscribe.registerNotice (amend, register another attendee)
    - On launch day:
        - Invitees:: Email invitations: details, prices, url+clientid, discontinueThis, discontinueThisCity, discontinueAll
        - Subscribers:: Email good news: details, prices, url+clientid, remindLater, discontinueThis, discontinueAll
    - On Register
        - Invitee|Subscriber => Registered: payment instructions, contactMe, referral-code promise
        - Other: you've been registered already
        
    - Collect payments
        - Registered => Attendee: thankyou, ticket, referral-code + share
    - On `X`
    - On `Y`
    - On `Z`
    - On day salesNormal-2 (two days of EarlyBird yet)
    - On day salesLate-2
    - On day D-2
    
    
Email actions:
    - discontinueThis - discontinue further emails on this event
    - discontinueThisCity - as above but for a city mismatch reason 
    - discontinueAll - discontinue all similar emails 
    - remindLater - remind later
    

[**[back-to-top](#table-of-contents)**]

### Pricing

Sales stages: EarlyBird, Normal, Late, OnSite

```
 Costs = Venue costs + Materials costs + Travel Costs
 MinimalProfit = ?      // minimal profit to earn
 
 ReferralsLimit = ?     // how many refunds provided as a maximum
 ReferralRefund[] = ?   // refund per referral per sales stage (decreases from stage to stage)
 ReferralDiscount[] = ? // discount provided by reference code per sales stage (decreases from stage to stage)
 // See Event entity specification below for details
 
 TicketMinimumPrice = (Costs + MinimalProfit) / U + ReferralDiscount[EarlyBird] + ReferralRefund[EarlyBird] * ReferralsLimit
  
 Example:
        Costs = 2500
        MinimalProfit = 500
        U = 15
        ReferralsLimit = 3
        ReferralRefund[EarlyBird] = 50
        ReferralDiscount[EarlyBird] = 50
    TicketMinumumPrice = (2500 + 500) / 15 + 50 + 50 * 3 = 400
     
```

Offer discount vouchers on Normal and Late stages only. Then `TicketPrice[Normal]`>=`TicketPrice[EarlyBird]`

Event Promotion Management fees options:
 1. We take money from Attendees between `W` and `Y` + 70% of ticket price difference until `Z`
 2. Fixed fee (included into Event costs) + 70% of ticket price difference from between `Y` and `Z`

[**[back-to-top](#table-of-contents)**]

## Application Structure

### Public Page

Sections:
 * Cover
 * Targeting
 * Workshop Modules
 * Choice of Bonus Modules
 * Promise to Answer Any Questions
 * Facts: When, Where, Vacant Seats, Cost; Map
 * Testaments [optional]
 * Photo Gallery from Earlier Events [optional]
 * Author
 * Subscription / Registration

[**[back-to-top](#table-of-contents)**]

### Management Page

Provides access to back-end: analysis, actions.

[**[back-to-top](#table-of-contents)**]

## Data Model

### Entities

**Individual**
 * name
 * telephone
 * email
 * isConfirmed
 * isSubscribed
 * unsubscribeToken

**Venue**
 * name
 * address
 * googleMapCoordinates
 * capacityPax
 * price1h
 * price3h
 * price6h
 * price8h
 * datePriceAsOf

**Event**
 * title
 * dateOn
 * timeStart
 * duration
 * isConfirmed
 * costTotal
 * *Venue
 * capacityTotal
 * capacityLastCall -- _equals `capacityTotal*0.9` or `capacityTotal-3`_
 * attendee-ReferralsLimit
 * attendee-EarlyBird-Until
 * attendee-EarlyBird-Price
 * attendee-EarlyBird-ReferralRefund
 * attendee-EarlyBird-ReferralDiscount
 * attendee-Normal-Until
 * attendee-Normal-Price
 * attendee-Normal-ReferralRefund -- _must be lesser than for previous stage_
 * attendee-Normal-ReferralDiscount -- _must be lesser than for previous stage_
 * attendee-Late-Until
 * attendee-Late-Price
 * attendee-Late-ReferralRefund -- _must be even lesser than for previous stage_
 * attendee-Late-ReferralDiscount -- _must be even lesser than for previous stage_
 * attendee-OnSite-Price
 * extraSubscribers -- _calculate overVacancies to tell people how many are willing to attend next event_

```
Actual minimum revenue from an attendee =
    Price - FriendDiscount - 3 * max(ReferralDiscount)
```

**Workshop-Attendee**
 * *Workshop
 * *Attendee
 * isSubscribed -- _attendee may terminate further reminders and/or unsubscribe globally_
 * referralCode
 * friendsPaid
 * sumToRefundForReferral -- _from initial Workshop::attendee-FriendsDiscountLimit friends_
 * dateInvited
 * dateRegistered
 * datePmntInstructionsSent
 * dateBasicUntilNotified
 * dateLateUntilNotified
 * dateLastCallNotified
 * datePaid
 * sumPaid
 * isBalanceAligned -- _goto SendTicket()_
 * dateTicketSent

**Token**
 * *Attendee
 * *Workshop
 * token
 * forAction
 * isUsed

[**[back-to-top](#table-of-contents)**]

## Business Logic

### Public: Attendee Related Behaviour

```
bttnCallToAction = isSetCookie(registered)
    ? 'actionUpdateMyData-or-RegisterAnotherAttendee'
    : 'actionRegisterMe'

on actionUpdateMyData-or-RegisterAnotherAttendee {
        bttnCallToAction = actionRegisterMe
        UnsetCookie(registered)
        reparse sectionBonusModules.show
        reparse sectionSubscription.show
    }

sectionBonusModules.show = isSetCookie(registered)
    ? CheckboxesHide
    : CheckboxesShow

sectionSubscription.show = isSetCookie(registered)
    ? ThankYou + bttnCallToAction + bttnContactMe
    : Register

```

```
On actionRegisterMe {
    if isSetCookie(registered).email == input.email
        SubmitAndDo(emailConfirmDataUpdate) =
            Thank you! You will be asked to cofirm update by email.
    else
        SubmitAndDo(emailRegister) =
            Thank you! You will be asked to confirm your email and provided with pmnt istructions.
    SetCookie(registered)=input.email
}

On actionContactMe
    SubmitAndDo(emailContactOnRequest) =
        We shall contact you by email first
```

[**[back-to-top](#table-of-contents)**]

### Public: Back-End Data Related Behaviour

```
Initialization config
    WorkshopId = ? // also submitted along with user submissions
    ReferralCode = ? // extracted from url and submitted along with user submissions

Initialization from back-end data
    sectionLocation.*
    sectionSubscribe.*
```

```
if (WorkshopVacancies == 0) {
    sectionLocation.Seats = No vacancies. Please subscribe for next workshop announcement
    sectionLocation.Price = Mark deleted
    bttnCallToAction = actionSubscribeForNextEvent
    }

On actionSubscribeForNextEvent
    SubmitAndDo(emailSubscribe)
        Thank you. We've run out of vacancies. We shall inform you on next workshop date.
        BTW, we have already ... pax subscribed for the next workshop.
```

[**[back-to-top](#table-of-contents)**]

### Private: Management


[**[back-to-top](#table-of-contents)**]

# Credits

This Landing Page is based on
[Stylish Portfolio](http://startbootstrap.com/template-overviews/stylish-portfolio/),
which is a responsive, one page portfolio theme for [Bootstrap](http://getbootstrap.com/) created by [Start Bootstrap](http://startbootstrap.com/). The theme features multiple content sections with an off canvas navigation menu.

Copyright 2013-2016 Blackrock Digital LLC. Code released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-stylish-portfolio/blob/gh-pages/LICENSE) license.

Start Bootstrap was created by and is maintained by **[David Miller](http://davidmiller.io/)**, Owner of [Blackrock Digital](http://blackrockdigital.io/).

* https://twitter.com/davidmillerskt
* https://github.com/davidtmiller

Start Bootstrap is based on the [Bootstrap](http://getbootstrap.com/) framework created by [Mark Otto](https://twitter.com/mdo) and [Jacob Thorton](https://twitter.com/fat).

# This Implementation Copyright and License

Copyright 2016 Oleksiy Rudenko. Code released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-stylish-portfolio/blob/gh-pages/LICENSE) license.

[**[back-to-top](#table-of-contents)**]