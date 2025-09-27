from .. import Database


ThingCategory = Database.Controller.Objects.ThingCategory
Thing = Database.Controller.Objects.Thing

ThingCategoryManager = Database.Controller.Managers.ThingCategory
ThingManager = Database.Controller.Managers.Thing


def seed_things():
    # Seed Categories
    thing_categories = [
        ThingCategory(name="Assets"),
        ThingCategory(name="Finance"),
        ThingCategory(name="Property"),
        ThingCategory(name="Responsibilities"),
        ThingCategory(name="Learning"),
        ThingCategory(name="Vehicles"),
    ]
    thing_category_id_lookup = {}
    for cat in thing_categories:
        cat_id = ThingCategoryManager.create(cat)
        thing_category_id_lookup[cat.name] = cat_id
        print(f"Created category: {cat.name} (ID: {cat_id})")

    thing_id_lookup = {}

    def add_thing(name, category, description, docs_link, parent=None):
        category_id = thing_category_id_lookup.get(category)
        parent_id = thing_id_lookup.get(parent) if parent else None
        thing = Thing(
            name=name,
            category_id=category_id,
            description=description,
            docs_link=docs_link,
            parent_id=parent_id,
        )
        thing_id = ThingManager.create(thing)
        thing_id_lookup[thing.name] = thing_id
        print(f"Created thing: {thing.name} (ID: {thing_id})")
        return thing_id

    add_thing(
        name="House",
        category="Property",
        description="Family home",
        docs_link="http://docs.house.com",
    )
    add_thing(
        name="Pool",
        category="Property",
        description="Outdoor swimming pool",
        docs_link="http://docs.pool.com",
        parent="House",
    )
    add_thing(
        name="Garden",
        category="Responsibilities",
        description="Vegetable garden",
        docs_link="http://docs.garden.com",
        parent="House",
    )
    add_thing(
        name="Laptop",
        category="Assets",
        description="Personal mac laptop",
        docs_link="http://docs.laptop.com",
    )
    add_thing(
        name="Truck",
        category="Vehicles",
        description="Pickup truck",
        docs_link="http://docs.truck.com",
    )
    add_thing(
        name="SUV",
        category="Vehicles",
        description="Family SUV",
        docs_link="http://docs.suv.com",
    )
    add_thing(
        name="Furnishings",
        category="Assets",
        description="Home furnishings",
        docs_link="http://docs.furnishings.com",
        parent="House",
    )
    add_thing(
        name="Couch",
        category="Assets",
        description="Living room couch",
        docs_link="http://docs.couch.com",
        parent="Furnishings",
    )
    add_thing(
        name="Software",
        category="Learning",
        description="Learning via software",
        docs_link="http://docs.database.com",
    )
    add_thing(
        name="Planner Project",
        category="Learning",
        description="Learning via Planner Project",
        docs_link="http://docs.plannerproject.com",
        parent="Software",
    )
    add_thing(
        name="Database",
        category="Learning",
        description="Learning via Database",
        docs_link="http://docs.database.com",
        parent="Software",
    )

    return thing_id_lookup
