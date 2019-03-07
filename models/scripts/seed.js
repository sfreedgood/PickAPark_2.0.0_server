const { User, Park, Camp } = require('../models/model')

const main = async () => {
    await User.destroy({
        where: {}
    })

    await Park.destroy({
        where: {}
    })

    await Camp.destroy({
        where: {}
    })

    const User_One = await User.create({
        user_name: 'test',
        email: 'testy@test.test',
        password: 'irrelevant',
        session_token: "don't worry about it, I'm legit"
    });

    const Camp_One = await Camp.create({
        camp_id: 1,
        park_code: "Didn't break ? true : false",
        name: "Didn't break ? true : false",
        description: "Didn't break ? true : false",
        directions_overview: "Didn't break ? true : false",
        weather_overview: "Didn't break ? true : false",
        directions_url: "Didn't break ? true : false",
        lat_long: "Didn't break ? true : false",
    })

    const Park_One = await Park.create({
        name: "Try Again ? success : failure",
        designation: "Try Again ? success : failure",
        description: "Try Again ? success : failure",
        directions: "Try Again ? success : failure",
        lat_long: "Try Again ? success : failure",
        weather: "Try Again ? success : failure",
        url: "Try Again ? success : failure",
        park_code: "Try Again ? success : failure",
    })

    const User_Two = await User.create({
        user_name: 'cheese',
        email: 'cheesey@cheese.cheese',
        password: 'nope',
        session_token: "don't worry about it, I'm legit"
    });

    const Camp_Two = await Camp.create({
        camp_id: 2,
        park_code: "me 2",
        name: "me 2",
        description: "me 2",
        directions_overview: "me 2",
        weather_overview: "me 2",
        directions_url: "me 2",
        lat_long: "me 2",
    })

    const Park_Two = await Park.create({
        name: "me 2 too",
        designation: "me 2 too",
        description: "me 2 too",
        directions: "me 2 too",
        lat_long: "me 2 too",
        weather: "me 2 too",
        url: "me 2 too",
        park_code: "me 2 too",
    })

    const User_Three = await User.create({
        user_name: 'poop',
        email: 'poopy@poop.poop',
        password: 'secret',
        session_token: "don't worry about it, I'm legit"
    });

    const Camp_Three = await Camp.create({
        camp_id: 3,
        park_code: "me 3",
        name: "me 3",
        description: "me 3",
        directions_overview: "me 3",
        weather_overview: "me 3",
        directions_url: "me 3",
        lat_long: "me 3",
    })

    const Park_Three = await Park.create({
        name: "me 3 also",
        designation: "me 3 also",
        description: "me 3 also",
        directions: "me 3 also",
        lat_long: "me 3 also",
        weather: "me 3 also",
        url: "me 3 also",
        park_code: "me 3 also",
    })

    await User_One.setParks([Park_One, Park_Two, Park_Three])
    await User_Two.setParks([Park_Two, Park_Three])
    await User_Three.setParks(Park_Three)


    await User_One.setCamps([Camp_One, Camp_Two, Camp_Three])
    await User_Two.setCamps([Camp_Two, Camp_Three])
    await User_Three.setCamps(Camp_One)
    
    process.exit()
}

main()