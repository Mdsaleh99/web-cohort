/*

======= see mongo aggregation HC in mongodb database ==============

Aggregation Pipeline
An aggregation pipeline consists of one or more stages that process documents:

Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.

The documents that are output from a stage are passed to the next stage.

An aggregation pipeline can return results for groups of documents. For example, return the total, average, maximum, and minimum values.



// -----------------------------------------------------------------------------------


The $group stage in MongoDB's aggregation framework is used to group documents by a specified key and perform operations on the grouped data. The output is one document for each unique group key.

Syntax
{
  $group: {
    _id: <expression>, // Group key
    <field1>: { <accumulator1>: <expression1> },
    ...
  }
}

_id: The group key. This can be a field or an expression. If _id is set to null or a constant value, the $group stage returns a single document that aggregates values across all input documents.

field: Additional fields that are computed using accumulator expressions.



// -----------------------------------------------------------------------------------


The $match stage in MongoDB's aggregation framework is used to filter documents based on a specified query predicate. The documents that match the criteria are passed to the next stage in the pipeline.

Syntax
{ $match: { <query predicate> } }

The syntax for the $match query predicate is identical to the syntax used in the query argument of a find() command.

Example
To filter documents in a sales collection where the status is "A":

db.sales.aggregate([
  { $match: { status: "A" } }
])

Best Practices

Pipeline Optimization: Place the $match stage as early in the aggregation pipeline as possible. This minimizes the number of documents processed in subsequent stages, improving performance.

Index Utilization: If $match is at the beginning of the pipeline, it can take advantage of indexes, similar to db.collection.find() or db.collection.findOne().

Restrictions

You cannot use $where, $near, or $nearSphere in a $match stage.

To use $text in a $match stage, it must be the first stage of the pipeline.

For data stored in MongoDB Atlas, you can use the Atlas Search compound operator filter option to match or filter documents when running $search queries. This is more performant than running $match after $search.

*/

// -----------------------------------------------------------------------------------

// 1. How many users are active?
[
  {
    $match: {
      isActive: true,
    },
  },
  {
    $count: "activeUsers",
  },
];
/*

$count (aggregation)
$count
Passes a document to the next stage that contains a count of the number of documents input to the stage.

Syntax
{ $count: <string> }
<string> is the name of the output field which has the count as its value. <string> must be a non-empty string, must not start with $ and must not contain the . character.

*/

// -----------------------------------------------------------------------------------

// 2. what is the average age of all users?
// first group by null doing this all users comes under one document. if we do group by gender and age it gives diffrent category of gender and age so to avoid this we used null

[
  {
    $group: {
      _id: null,
      averageAge: {
        $avg: "$age",
      },
    },
  },
];

// -----------------------------------------------------------------------------------

// 3. list top 5 most common favorite fruits among the users?
// In MongoDB's aggregation framework, the expression { $sum: 1 } is used to count the number of documents in each group. When you use $sum with a constant value of 1, it effectively increments the count by one for each document in the group.
[
  {
    $group: {
      _id: "$favoriteFruit",
      count: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
  {
    $limit: 5,
  },
];

// -----------------------------------------------------------------------------------

// 4. find the total number of males and females?
/*

In MongoDB's aggregation framework, both $sum and $count are used to aggregate data, but they serve different purposes and are used in different contexts.

$sum

Purpose: Calculates the sum of numeric values.

Usage: Can be used within the $group stage to sum the values of a specified field or to count documents by summing a constant value (e.g., 1).

Example: Summing the price field for each unique band_name in the albums collection:
db.albums.aggregate([
  {
    $group: {
      _id: "$band_name",
      total: { $sum: "$price" }
    }
  }
]);


$count

Purpose: Counts the number of documents that pass through the pipeline.

Usage: Used as a standalone stage to count documents.

Example: Counting the number of documents in the albums collection:
db.albums.aggregate([
  { $count: "totalDocuments" }
]);


Key Differences

Context: $sum is used within the $group stage to perform summation operations, while $count is used as a standalone stage to count documents.

Functionality: $sum can sum the values of a specific field or a constant value, whereas $count simply counts the number of documents.
*/

[
  {
    $group: {
      _id: "$gender",
      genderCount: {
        $sum: 1,
      },
    },
  },
];

// -----------------------------------------------------------------------------------

// 5. which country has the highest number of registered users?
[
  {
    $group: {
      _id: "$company.location.country",
      userCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      userCount: -1,
    },
  },
  {
    $limit: 3,
  },
];

// -----------------------------------------------------------------------------------

// 6. list all the unique eye color prsent in the collection?
[
  {
    $group: {
      _id: "$eyeColor",
    },
  },
];

// -----------------------------------------------------------------------------------

// 7. what is the average number of tags per user?

/*

The $unwind stage in MongoDB's aggregation framework deconstructs an array field from the input documents to output a document for each element in the array. Each output document is the input document with the value of the array field replaced by the element.

Example
Consider a collection named inventory with the following document:

db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })

Using the $unwind stage to output a document for each element in the sizes array:

db.inventory.aggregate([ { $unwind : "$sizes" } ])

The operation returns the following results:

{ "_id" : 1, "item" : "ABC1", "sizes" : "S" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "M" }
{ "_id" : 1, "item" : "ABC1", "sizes" : "L" }

Each document is identical to the input document except for the value of the sizes field, which now holds a value from the original sizes array.

Options

preserveNullAndEmptyArrays: When set to true, includes documents where the array field is missing, null, or an empty array in the output.

*/

// method 1
[
  {
    $unwind: "$tags",
  },
  {
    $group: {
      _id: "$_id",
      numberOfTags: {
        $sum: 1,
      },
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
];

// method 2
[
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: ["$tags", []] },
      },
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
][
  // -----------------------------------------------------------------------------------

  // 8. how many users have 'enim' as one of their tags?
  ({
    $match: {
      tags: "enim",
    },
  },
  {
    $count: "userWithEnimTag",
  })
][
  // -----------------------------------------------------------------------------------

  // 9. what are the names and age of the users who are inactive and have 'velit' as a tag?
  /*

The $project stage in MongoDB's aggregation framework is used to include, exclude, or add new fields to the documents that pass through the pipeline. It allows you to shape the documents by specifying which fields to return to the client.

Definition
$project passes along the documents with the requested fields to the next stage in the pipeline. The specified fields can be existing fields from the input documents or newly computed fields.

Considerations

Empty Specification: MongoDB returns an error if the $project stage is passed an empty document.

Array Index: You cannot use an array index with the $project stage.

Stage Placement
The $project stage should typically be the last stage in your pipeline, used to specify which fields to return to the client. Using a $project stage at the beginning or middle of a pipeline to reduce the number of fields passed to subsequent pipeline stages is unlikely to improve performance, as the database performs this optimization automatically.

*/

  ({
    $match: {
      isActive: false,
      tags: "velit",
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      age: 1,
    },
  })
][
  // -----------------------------------------------------------------------------------

  // 10. how many users have a phone number starting with '+1 (940)'?
  ({
    $match: {
      "company.phone": /\+1\s?\(940\)/,
    },
  },
  {
    $count: "phoneNo",
  })
][
  // -----------------------------------------------------------------------------------

  // 11. who has registered most recently?
  ({
    $sort: {
      registered: -1,
    },
  },
  {
    $limit: 4,
  },
  {
    $project: {
      name: 1,
      registered: 1,
      favoriteFruit: 1,
    },
  })
][
  // -----------------------------------------------------------------------------------

  // 12. categorise user by the favorite fruit?
  // https://www.mongodb.com/docs/manual/reference/operator/aggregation/push/

  /*

The $push operator in MongoDB's aggregation framework returns an array of all values that result from applying an expression to documents. It is available in the following stages:
$bucket
$bucketAuto
$group
$setWindowFields (Available starting in MongoDB 5.0)


Behavior:
When using $push in a $group stage, the order of the documents coming into the pipeline determines the order of the documents in the output array. To guarantee a defined order, the $group pipeline stage should follow a $sort stage. 

*/
  {
    $group: {
      _id: "$favoriteFruit",
      users: { $push: "$name" },
    },
  }
][
  // -----------------------------------------------------------------------------------

  // 13. how many users have 'ad' as the second tag in their list of tags?
  ({
    $match: {
      "tags.1": "ad",
    },
  },
  {
    $count: "secondTagAd",
  })
][
  // -----------------------------------------------------------------------------------

  // 14. find users who have both 'enim' and 'id' as their tags?
  // The $all operator in MongoDB selects documents where the value of a field is an array that contains all the specified elements.

  // Syntax
  // To specify an $all expression, use the following prototype:

  // { <field>: { $all: [ <value1>, <value2>, ... ] } }

  {
    $match: {
      tags: { $all: ["enim", "id"] },
    },
  }
][
  // -----------------------------------------------------------------------------------

  // 15. list all the companies located in the USA with their corresponding user count?
  ({
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: "$company.title",
      userCount: { $sum: 1 },
    },
  })
][
  // -----------------------------------------------------------------------------------

  /*

The $lookup stage in MongoDB performs a left outer join to a collection in the same database, adding a new array field to each input document. This new array field contains the matching documents from the "joined" collection. The reshaped documents are then passed to the next stage in the aggregation pipeline.

Starting from MongoDB 5.1, you can use $lookup with sharded collections. If you need to combine elements from two different collections, you can use the $unionWith pipeline stage.

The $lookup stage can be used in MongoDB Atlas, MongoDB Enterprise, and MongoDB Community.

Syntax
The $lookup stage takes a document with the following fields:


from: The collection to join.

localField: The field from the input documents.

foreignField: The field from the documents of the "from" collection.

as: The name of the new array field to add to the input documents.

pipeline: Specifies the pipeline to run on the foreign collection. The pipeline cannot include the $out or $merge stages. Starting in v6.0, the pipeline can contain the Atlas Search $search stage as the first stage inside the pipeline.

The pipeline cannot directly access the document fields. Instead, define variables for the document fields using the let option and then reference the variables in the pipeline stages using the "$$<variable>" syntax.

To combine elements from two different collections, use the $unionWith pipeline stage.

*/

  ({
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details",
    },
  },
  {
    $addFields: {
      author_details: {
        $arrayElemAt: ["$author_details", 0],
      },
    },
  })
];

/*

The $arrayElemAt operator in MongoDB returns the element at the specified array index. It can be used in the aggregation framework to access elements within an array based on their position.

Syntax
{ $arrayElemAt: [ <array>, <idx> ] }


<array>: Any valid expression that resolves to an array.

<idx>: Any valid expression that resolves to an integer.

Behavior

If <idx> is zero or a positive integer, $arrayElemAt returns the element at that position, counting from the start of the array.

If <idx> is a negative integer, it returns the element at that position, counting from the end of the array.

If <idx> exceeds the array bounds, it does not return a result.

If <array> resolves to an undefined array, it returns null.

Example
Consider a collection named users with the following documents:

{ "_id" : 1, "name" : "dave123", favorites: [ "chocolate", "cake", "butter", "apples" ] }
{ "_id" : 2, "name" : "li", favorites: [ "apples", "pudding", "pie" ] }
{ "_id" : 3, "name" : "ahn", favorites: [ "pears", "pecans", "chocolate", "cherries" ] }
{ "_id" : 4, "name" : "ty", favorites: [ "ice cream" ] }

To return the first and last element in the favorites array:

db.users.aggregate([
   {
     $project: {
         name: 1,
         first: { $arrayElemAt: [ "$favorites", 0 ] },
         last: { $arrayElemAt: [ "$favorites", -1 ] }
      }
   }
])

This operation returns:

{ "_id" : 1, "name" : "dave123", "first" : "chocolate", "last" : "apples" }
{ "_id" : 2, "name" : "li", "first" : "apples", "last" : "pie" }
{ "_id" : 3, "name" : "ahn", "first" : "pears", "last" : "cherries" }
{ "_id" : 4, "name" : "ty", "first" : "ice cream", "last" : "ice cream" }

Compatibility
$arrayElemAt is compatible with MongoDB Atlas, MongoDB Enterprise, and MongoDB Community.

*/
