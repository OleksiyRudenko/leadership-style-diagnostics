`[2016-08-07] - created`

# Workshop Landing Page

A Landing Page template for a workshop.

## Table of Contents

1. [The Process](#the-process)
    1. [Process Overview](#process-overview)
    1. [Definitions](#definitions)
    1. [Workflow Model](#workflow-model)
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

One may want to run a probably recurring Workshop. It might be reasonable to run a survey prior
to any principal activities. The prospects database shall be used if any. Any respondents become
prospects. Any involved individual may reject further communications on the promoted event as well
as on any future events. However, any interest restores individual as a prospect.

Pricing differentiation may be employed (EarlyBird, Normal, Late, OnSite/NightOwl).

Promo codes can be used to boost sales. Promo codes can be published by attendees only.
Promo code provides discount for limited/unlimited number of attendee's affiliates.
Attendee can benefit from acquiring his/her affiliates. However, limited number of those
earn benefit for the attendee (normally 3 only). And benefit can be used to pay for
future events.

PostEvent phase allows attendees to download materials, provide feedback.

Prospects and Attendees can do general inquiries or request for refund.

Attendees may obtain vouchers on cash discounts for future events.

The process in general described below. Please, refer to other parts of documentation
to learn about IT support provided.

[**[back-to-top](#table-of-contents)**]

### Definitions

**Individual**

In global context:
 * Attendee - prospect
 * Refugee - explicitly rejected any further communications; reset when registers to any Event
 * Speaker - speaker
 * Host - hosts events
 * Admin (to a Host) - administrates Host's events

In context of Event:
 * Invitee - invited by host to visit landing page/registration
 * Subscriber - subscribed for event launch notice
 * Rejector - rejected further notices at any stage. Reasons stored
 * Registered - registered while not paid yet
 * Attendee - admittance paid
 * Pending - didn't reject but `Z` reached before individual became Attendee
 * Graduate - attended event
 * Skipper - paid but didn't attend event

`V` - absolute required minimum count(Attendees)
`W` - pre-last call threshold
`X` - optimal count(Attendees)
`Y` - last call threshold
`Z` - maximum count(Attendees)

**Dates/Milestones**
 * Day `D` - Day of Event
 * Day `S` - Day of Sales Campaign launch

All date calculations consider business days. E.g. if day `D` is Tuesday then day `D-2`
is a precedent Friday.

**Sales KPI**
 * `avg(x)` - average daily sales over last `x` days
 * `avg(S)` - average daily sales since day `S`
 * `avg(Normal)` - average daily sales since Normal sales phase start
 * `avg(Late)` - average daily sales since Normal sales phase start

[**[back-to-top](#table-of-contents)**]

### Workflow Model

Phases:
 * Initialization
 * Survey - reveal interest if any
 * Sales Campaign
 * Sales Boost - invoked when sales progress is poor
 * Postponement - invoked when sales target achievable but more time required
 * Cancellation - invoked when sales target obviously cannot be achieved in reasonable
    time scope
 * Sales Closed - invoked when sales target achieved before day D
 * D-Day - on day D
 * PostEvent - on day after day D

#### Initialization
 * Define Host, Admin
 * Define re Event: topic and components, location(city), duration,
    { `U`, `W`, `X`, `Y`, `Z`}, external resources (web-site, page on social network)
 * Add Invitees to the Event context
    
#### Survey
 * Define Survey questions
 * Make a landing page (cover, targeting, modules, extras, testimonials/gallery,
    {when,where,seats,price}.proposed, author, `subscribe` = `subscribe.survey|surveyNotice`)
    - Survey: contacts (name, email, telephone, city), checkbox (would attend in my city),
        date options
    - Survey form pre-populated with data from cookies/browser-input-history/email-url/DB
    - If isSubscriber then `subscribe.surveyNotice` = thank you; click if you want to
        change anything -> `subscribe.survey`; share
    - On submission: Invitee => Subscriber
 * Publish on social networks / venues sites
 * Invitee: Email invitation: url+clientid, [remindLater,] discontinueThis, discontinueAll
 * Collect Subscribers:
    - email confirmation: thank you, on city-mismatch -> discontinueThisCity
    - notify Host
    
#### Sales Campaign
 * Define re Event: date and time, location, prices
 * Create event notices on social networks / venues sites
 * Update Landing Page: ... refs to public events, `subscribe` = `subscribe.register`
    - If isRegistered then `subscribe` = `subscribe.registerNotice`
        (amend, register another attendee)
 * On Register
    - Invitee|Subscriber => Registered: payment instructions, contactMe, [referral-code promise]
    - Other: you've been registered already
 * Collect payments
    - Registered => Attendee: Email pmnt confirmation: thankyou, ticket, [referral-code,]
        share, url.calendarEntry

count(Attendee) Milestones:
 * ~~On `V`:~~
 * On `W`:
    - Invitee|Subscribed|Registered: optimum group is nearly formed, `W/days_since_S`
        are sold daily, discontinueThis|All
    - Registered: + pmnt instructions, contactMe
 * On `X`:
    - Invitee|Subscribed|Registered: Hurry!: group is formed, still `Z-X` seats remain,
        `X/days_since_S` are sold daily, discontinueThis|All
    - Registered: + pmnt instructions, contactMe
 * On `Y`:
    - Invitee|Subscribed|Registered: Last call: `Z-Y` seats remain, discontinueThis|All
    - Registered: + pmnt instructions, contactMe
 * On `Z`:
    - goto **#Sales-Closed**

Timeline Milestones:
 * On day `S`:
    - Invitee: Email invitation: details, prices, url+clientid, [remindLater,] discontinueThis, discontinueThisCity, discontinueAll
    - Subscriber: Email good news: details, prices, url+clientid, [remindLater,] discontinueThis, discontinueAll
 * On day `salesNormal-2` (two days of EarlyBird yet):
    - Invitee|Subscriber: Email price: 2 days before price raise, discontinueThis|All
    - Registered: Email price: 2 days before price raise, contactMe
 * On day `salesLate-2`:
    - Invitee|Subscriber: Email price: 2 days before price raise, discontinueThis|All
    - Registered: Email price: 2 days before price raise, contactMe
 * On day `D-5`:
    - If count(Attendees) less than
        - `V-avg(7)*5`:
            - Attendee: invite friends, get voucher, promo-code
            - Registered: pay and get voucher
            - Subscriber: register to get special offer -> pay and get voucher
        - `X-avg(7)*5`: _possibly sales boost techniques_
        - `Z-avg(7)*5`: _possibly sales boost techniques_
 * On day `D-2`:
    - If count(Attendees) less than
        - `V-avg(7)*7`: goto **#Cancellation**
        - `V-avg(7)*2`: invoke **#Postponement**; retry end-of-day
        - `X-avg(3)*2`: _possibly sales boost techniques_
        - `Z-avg(3)*2`: _possibly sales boost techniques_
    - Invitee|Subscriber|Registered: Last call: 2 days before price raise, discontinueThis|All
    - Registered: + contactMe
 * On day `D-1`:
    - If count(Attendees) less than
        - `V-avg(3)`: goto **#Cancellation**
        - `X-avg(3)`: _possibly sales boost techniques_
        - `Z-avg(3)`: _possibly sales boost techniques_
    - If count(Attendees) > `V`: reminder

#### Postponement

If there is resource among Subscribed|Registered to achieve targets:
 * Registered:
    - we have count(Attendees); still `V-count(Attendees)` seats vacant; unlikely that we make
      it till Day D; but if you make a decision right now, you could save the Event;
      we grant you a discount to make it easier for you to decide + promo-code for your friends
      (extra per-friend vouchers) who will get discounts and you earn extra voucher;
    - please, decide: pay or url.discontinueThis
 * Subscribed:
    - _same as above_ but also url.getRegistered

If no resource among Registered to achieve targets:
 * Web-site:
    - update date, add 'POSTPONED' banner
    - If isAttendee: url-contactMe for refund if you wish
 * Subscriber|Registered: there still `n` attendees required to run the Event
    (currently we have ...); trend shows we need extra `m` days to get those;
     therefore we have to postpone 1 week; if you're OK with that and really want to
     participate, please, register and pay
 * Attendee: + refund instruction, voucher option + discount

#### Cancellation
 * Web-site:
    - `buttonAction` = Keep Updated
    - `subscribe` = `subscribe.keepUpdated`
 * Subscriber|Registered: unfortunately, we have to cancel; if you still interested in the topic
    then url+clientid
 * Attendee: + refund instruction, voucher option + discount
 **FINAL STATE**

#### Sales Closed
 * Web-site:
    - add banner 'WE ARE COMPLETE for this time'
    - `buttonAction` = is!Attendee: Keep Updated
    - `subscribe` = `subscribe.keepUpdated`
 * Invitee|Subscribed|Registered: we are complete, we'll keep you posted
 * Registered: + please, do not pay; if you've already done but haven't received
    confirmation yet, please, url.contactMe
 * Attendee: we are complete!; looking forward to seeing you

#### D-Day
 * Web-site:
    - add banner 'WE ARE COMPLETE for this time'
    - `buttonAction` = is!Attendee: Keep Updated
    - `subscribe` = `subscribe.keepUpdated`
 * Attendee: looking forward to seeing you today

#### PostEvent
 * Web-site:
    - downloads
    - feedback summary => testaments
    - pictures
    - `survey` = `survey.furtherTopics` + `survey.feedback`
 * Attendee => Graduate|Skipper
 * Graduate : thankyou, url.downloads@clientId
 * Skipper : itsapity, voucher-as-a-compensation
 * Others : see how it's been : url.#Testaments

#### Appendix: Email Actions Reference
- discontinueThis = discontinue further emails on this event: *=>Rejector
- discontinueThisCity = as above but for a city mismatch reason: *=>Rejector, store City
- discontinueAll = discontinue all similar emails: *=>Rejector&Refugee
- contactMe = personal contact request: email to confirm telephone. Request types:
    - i've paid but still receive emails as if I wouldn't have had
    - [want money back]
    - other questions
- remindLater = remind later

[**[back-to-top](#table-of-contents)**]

### Pricing

Sales stages: EarlyBird, Normal, Late, OnSite/NightOwl

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