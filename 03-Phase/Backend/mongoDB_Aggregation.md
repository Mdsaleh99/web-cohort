# MongoDB Aggregation Pipelines
 1. Powerful Data Transformation 🔥
    - Aggregation pipelines let you manipulate documents in complex ways — filter, group, sort, reshape, compute, etc. — all within the database.

    - Example: Want total sales per product per month? Done in a few pipeline stages, no need to fetch everything into your app.

 2. Performance Optimization 🚀

    - Since everything runs inside MongoDB (close to the data), it's faster than doing computations in your backend. Plus, you can:

    - Use indexes in some stages ($match, $sort)

    - Stream results stage by stage (low memory usage)

 3. Modular, Stage-by-Stage Design 🧱
    - Each stage ($match, $group, $project, etc.) performs a specific job, and you chain them to build complex queries cleanly.
    ```js
    [
        { $match: { status: "active" } },
        { $group: { _id: "$category", total: { $sum: "$price" } } },
        { $sort: { total: -1 } }
    ]
    ```
4. Supports Rich Operations 🧠
    - It’s not just filtering or grouping. You can:
    - Do string manipulations
    - Perform date arithmetic
    - Work with arrays and nested fields
    - Join collections ($lookup),etc.

 6. Good for Analytics 🧰
    - You can build reporting, dashboards, real-time metrics, and more, right on your data layer.

# Practice Problems
[Link for Data](https://gist.github.com/hiteshchoudhary/a80d86b50a5d9c591198a23d79e1e467)
## Sample User document
```json
{
  "_id": {
    "$oid": "67f1b2e6482706933fdffe48"
  },
  "index": 0,
  "name": "Aurelia Gonzales",
  "isActive": false,
  "registered": {
    "$date": "2015-02-11T04:22:39.000Z"
  },
  "age": 20,
  "gender": "female",
  "eyeColor": "green",
  "favoriteFruit": "banana",
  "company": {
    "title": "YURTURE",
    "email": "aureliagonzales@yurture.com",
    "phone": "+1 (940) 501-3963",
    "location": {
      "country": "USA",
      "address": "694 Hewes Street"
    }
  },
  "tags": [
    "enim",
    "id",
    "velit",
    "ad",
    "consequat"
  ]
}
```
## Q1. How many users in DB are active?

```js
[
  {
    $match: {
      isActive: true
    }
  },
  {
    $count: "Active Users"
  }
]
```

## Q2. What is the average age of the users? **Markdown**:

```js
[
  {
  		$group: {
          _id:null,
          average : {
            $avg : "$age"
          }
      }
  },
]
```
### 🤔 Why Do We Need to Use `$group` to Calculate the Average?

- MongoDB’s **aggregation pipeline** consists of stages, and each stage performs a specific operation.

- To compute values like **average**, **sum**, **min**, **max**, etc., we use the `$group` stage.


### 📊 Why Group All Documents Into One Group?

If we want the **average age of all users**, we need to treat the **entire collection** as **a single group**.

```js
{
  $group: {
    _id: null,
    average: { $avg: "$age" }
  }
}
```

- `_id: null` → This tells MongoDB to group **all documents together**.
- `$avg: "$age"` → This calculates the average of the `age` field across all documents.



### 🔧 Why Not Just Use `$avg` Without Grouping?

- MongoDB **doesn’t allow** using `$avg` directly outside of `$group` or similar stages.

- You **must** use `$group` to calculate aggregates **across multiple documents**.


### 🧠 Analogy

- Think of `$group` as the **calculator stage**.  
Without it, MongoDB processes documents **one-by-one**, not as a set.


## Q3. List the top 5 most common fruit among the user
```js
[
  {
  		$group: {
          _id:"$favoriteFruit",
          count : {$sum: 1}
      }
  },
  {
    $sort: {
      count: -1 //-1 Sort in descending order (from highest to lowest).
    }
  },
  {
    $limit: 5
  }
]
```

## Q4. Find the total number of males and females

```js
[
  {
  		$group: {
            _id : "$gender",
            count : {
                $sum : 1
                }
      }
  }
]
```
### 🤔 Why Do We Use $sum: 1 Instead of $count in $group?

#### 📌 The `$count` Operator vs. `$sum: 1`

| Feature | `$count` | `$sum: 1` |
|--------|-----------|------------|
| Type | **Pipeline stage** | **Accumulator inside `$group`** |
| Use Case | Count **total number of documents** in the pipeline | Count **number of documents per group** |
| Placement | Used as a **standalone stage** | Used **inside** a `$group` stage |

## Q5. Which country has the highest number of registered user
- we can simply drill down to object with just `.` operator
```js
[
  {
    $group: {
      _id: "$company.location.country",
      userCount: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      userCount: -1
    }
  },
  {
    $limit: 1
  }
]
```

## Q6. List all the unique eye colors present in the collection
```js
[
  {
    $group: {
      _id: "$eyeColor",
    }
  },
]
```

## Q7. What is the average number of tags per user
### Option 1
- `$unwind` stage takes an array field in a document and splits it into multiple documents, each containing one element from the array. The rest of the document’s fields are duplicated in each of these new documents, with only the array element being different.
```js
[
  {
    $unwind: {
      path: "$tags",
    }
  },
  {
    $group : {
      _id : "$_id",
      numberOfTags : {
        $sum : 1
      }
    }
  },
  {
    $group : {
      _id : null,
      averageTags : {
        $avg : "$numberOfTags"
      }
    }
  }
]
```
### Option 2
- `$size` aggregation operator, **counts** and **returns** the total number of items in an array.
- we use `$ifNull` for error handling, if we don't find **tags** property in document then treat it like `[]` empty array
```js
[
  {
    $group : {
      _id : null,
      avaerageNumberOfTags : {
        $avg : {
          $size: {$ifNull : ["$tags",[]]}
        }
      }
    }
  },
]
```

## Q8. How many user have 'enim' as one of their tags?
- we can also use `"tags" : "enim"` which works same but when we use `$in`, we can also check for multiple values if we want to.

```js
[
  {
    $match: {
      "tags" : {"$in" : ["enim"]}	
    }
  },
  {
    $count: 'UsersWithEnimTag'
  }
]
```

## Q9. What are the names and age of users who  are inactive and have 'velit' as a tag?
- we can select which properties we want to forward in the next stage using `$project`, also we can add new computed properties using this.
```js
[
  {
    $match: {
      tags : "velit",
      isActive: false
    }
  },
  {
    $project: {
		name:1, age:1, _id: 0
    }
  }
]
```

## Q10. How many users have a phone number starting with +1 (940)
- use **Regex** to match pattern
```js
[
  {
    $match: {
      "company.phone": {$regex: /^\+1 \(940\)/}
    }
  },
  {
    $count : "UsersWithPhoneStartsWithSpecificPattern"
  }
]
```

## Q11. Who has registered most recently?
```js
[
  {
    $sort : {
      "registered" : -1
    }
  },
  {
    $limit: 1
  },
  {
    $project: {
      name: 1, registered: 1, favoriteFruit:1
    }
  }
]
```

## Q12. Categorize the user by their Favorite Fruit
- `$push` pushes specified value(s) in a array for each document in group
```js
[
  {
    $group: {
      _id: "$favoriteFruit",
      users : {$push : "$name"}
    }
  }
]
```

## Q13. How many users have 'ad' as the second tag in their list of tags?
- we can use `.` operator to access index of array
```js
[
  {
    $match: {
      "tags.1": 'ad',
    },
  },
  {
    $count : "SecondTagAd"
  }
]
```

## Q14. Find Users who have enim and id as their tags.
- `$all` selects array which contains all specified elements
```js
[
    {
        $match : {
            tags : {$all : ["enim", "id"]}
        }
    },
]
```

## Q15. List all the companies located in USA with Their corresponding user count.

```js
[
    {
        $match : {
          "company.location.country": "USA"
        }
    },
 	 {
     $group : {
       _id: "$company.title",
       Users : {
       		$sum : 1
       }
     }
   }
]
```

## Sample Authors Document
```js
{
  "_id": 100,
  "name": "F. Scott Fitzgerald",
  "birth_year": 1896
}
```
## Sample Books Document
```js
{
  "_id": 1,
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "Classic"
}
```

## Q16. Get Books with their author details
To join documents from the `books` collection with their corresponding author details from the `authors` collection, we use the `$lookup` stage in the aggregation pipeline.

### `$lookup` Fields Explained:

- **`from`**: The name of the **foreign collection** to join with (e.g., `"authors"`).
- **`localField`**: The field in the **current collection (`books`)** that you want to match.
- **`foreignField`**: The field in the **foreign collection (`authors`)** that should match the local field.
- **`as`**: The name of the **new field** in the output documents that will store the matched author details as an array.

```js
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details",
    }
  }
]
```

---