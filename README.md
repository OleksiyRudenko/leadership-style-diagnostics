`[2016-08-07] - created`

# Workshop Landing Page

A Landing Page template for a workshop.

## Table of Contents
1. [Structure](#structure)
    1. [Public Page](#public-page)
    1. [Management Page](#management-page)
1. [Data Model](#data-model)
    1. [Entities](#entities)
1. [Business Logic](#business-logic)
    1. [Public: Attendee Related Behaviour](#public-attendee-related-behaviour)
    1. [Public: Back-End Data Related Behaviour](#public-back-end-data-related-behaviour)
    1. [Private: Management](#private-management)


## Sructure

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

### Management Page

Provides access to back-end: analysis, actions.


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

**Workshop**
 * title
 * dateOn
 * timeStart
 * duration
 * isConfirmed
 * costTotal
 * *Venue
 * capacityTotal
 * capacityLastCall -- _equals `capacityTotal*0.9` or `capacityTotal-3`_
 * attendee-FriendsDiscountLimit
 * attendee-EarlyBird-Until
 * attendee-EarlyBird-Price
 * attendee-EarlyBird-ReferralDiscount
 * attendee-EarlyBird-FriendDiscount
 * attendee-Basic-Until
 * attendee-Basic-Price
 * attendee-Basic-ReferralDiscount -- _must be lesser than for previous stage_
 * attendee-Basic-FriendDiscount
 * attendee-Late-Until
 * attendee-Late-Price
 * attendee-Late-ReferralDiscount -- _must be even lesser than for previous stage_
 * attendee-Late-FriendDiscount
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

### Private: Management



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
