// import { natural } from "https://cdn.jsdelivr.net/npm/natural@6.12.0/lib/natural/index.min.js";


// export class  SentimentAnalysis{
//     constructor(text){
//         this.text =  text
//         this.analyzer = new natural.SentimentAnalyzer('English', PorterStemmer, 'afinn');
//     }
    
//     getSentimentResult(){
        
//         const sentiment = this.analyzer.getSentiment(this.text.split(" "));
        
//         if (sentiment > 0) {
//           console.log("Positive sentiment");
//           return "Positive"
//         } else if (sentiment < 0) {
//           console.log("Negative sentiment");
//           return "Negative"
//         } else { 
//           console.log("Neutral sentiment");
//           return "Neutral"
//         }

//     }

// }



// let sen = new SentimentAnalysis("Hellow what are your doing?")
// console.log(sen.getSentimentResult())
// console.log("This script is being run directly.");

// // if (require.main === module) {
// //   // This code will execute only if the current module is the main module
// // } else {
// //   // This code will execute if the current module is being imported as a module
// //   // console.log("This script is being imported as a module.");
// // }
// import { SentimentAnalysis } from '../../node_modules/natural/lib/natural/classifiers';

// // Create a SentimentAnalyzer instance
// const analyzer = new SentimentAnalysis("English");

// // Sample text for analysis
// const text = "This movie was absolutely fantastic!";

// // Tokenize the text (split into words)
// const tokens = text.split(/\s+/);

// // Get the sentiment score
// const sentiment = analyzer.getSentiment(tokens);

// console.log(`Sentiment score: ${sentiment}`);

// if (sentiment > 0) {
//   console.log("The text is positive.");
// } else if (sentiment < 0) {
//   console.log("The text is negative.");
// } else {
//   console.log("The text is neutral.");
// }


import { WordTokenizer } from '../../node_modules/natural/lib/natural/tokenizers'

let tokenizer = new WordTokenizer()
console.log(tokenizer.tokenize('your dog has fleas.'))
// [ 'your', 'dog', 'has', 'fleas' ]
