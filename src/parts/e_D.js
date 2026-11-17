/* ===================== ENGLISH OVERLAY: Module D (Machine Learning) ===================== */
addEN('d1-1',{obj:['Describe supervised learning in terms of data, model, loss and optimizer.','Fit a line by least squares with the closed form and with gradient descent.','Interpret $R^2$ and the residuals.'],
body:R`
<h2>1. Supervised learning at a glance</h2>
<p>We have training data $\{(\mathbf x_i,y_i)\}_{i=1}^n$ and want a function $f_\theta$ that predicts $y$ well on <i>new</i> data too. Every ML algorithm has four parts: <b>data</b>, a <b>model</b> (a space of functions), a <b>loss</b> (a measure of error) and an <b>optimizer</b> (a way to find the parameters). Regression means a continuous numeric output.</p>
<h2>2. The linear model and the squared loss</h2>
<p>Model: $\hat y=\mathbf w^\top\mathbf x+b$. Appending a column of ones to $X$ folds $b$ into $\mathbf w$: $\hat{\mathbf y}=X\mathbf w$. The residual of a sample is $r_i=\hat y_i-y_i$, and the mean squared error (MSE) is</p>
$$J(\mathbf w)=\frac1n\|X\mathbf w-\mathbf y\|_2^2$$
<p>Why squares? (a) smooth and convex, (b) it penalizes the biggest errors most, (c) it equals maximum likelihood under Gaussian noise (see the MLE lesson).</p>
<h2>3. Two ways to minimize $J$</h2>
<p><b>Normal equation:</b> set the gradient $\nabla J=\tfrac2n X^\top(X\mathbf w-\mathbf y)$ to zero:</p>
$$X^\top X\,\mathbf w=X^\top\mathbf y\ \Rightarrow\ \mathbf w^\*=(X^\top X)^{-1}X^\top\mathbf y$$
<p>Geometry: $X\mathbf w^\*$ is the orthogonal projection of $\mathbf y$ onto the column space of $X$ and the residual is perpendicular to it. If the columns are linearly dependent, $X^\top X$ is singular (the solution is not unique).</p>
<p><b>Gradient descent:</b> $\mathbf w\leftarrow\mathbf w-\eta\,\tfrac2nX^\top(X\mathbf w-\mathbf y)$. One step costs $O(nd)$ while the normal equation costs $O(nd^2+d^3)$; for large $d$, GD (or SGD) is cheaper. Because $J$ is convex, GD with a suitable $\eta$ reaches the same solution.</p>
${wd('linreg','Interactive linear regression: add points and watch w from the normal equation')}
<h2>4. Worked example</h2>
<p>Data $(1,2),(2,3),(3,5)$. Means $\bar x=2$ and $\bar y=10/3$. Slope $a=\frac{\sum(x-\bar x)(y-\bar y)}{\sum(x-\bar x)^2}=\frac{3}{2}=1.5$ and intercept $b=\bar y-a\bar x=1/3$. Predictions $1.83,\,3.33,\,4.83$; residuals $0.17,-0.33,0.17$ and $\mathrm{SSE}=0.1667$.</p>
<h2>5. $R^2$: how much of the variation do we explain?</h2>
$$R^2=1-\frac{\mathrm{SSE}}{\mathrm{SST}},\qquad \mathrm{SST}=\sum(y_i-\bar y)^2$$
<p>Here $\mathrm{SST}=4.667$, so $R^2\approx0.964$. $R^2=1$ is a perfect fit; $R^2=0$ means the model is no better than predicting the mean (on training data it is never negative; on test data it can be).</p>
${co('warn','Look at the residuals','A high $R^2$ alone is not enough: a curved pattern in the residuals means a linear model is wrong, and one outlier can drag the line strongly (leverage).')}`,
mis:['"Linear regression means the model can only draw a line." ← It is linear in the <i>parameters</i>; with features $x,x^2,\\log x$ it fits curves too.','"A high $R^2$ means good predictions on new data." ← Training $R^2$ says nothing about generalization.','"The normal equation is always the best way." ← For large $d$ or a badly conditioned $X^\\top X$, GD/SGD or QR/SVD is better.'],
ex:[{q:'Points $(1,2),(2,3),(3,5)$. What is the least-squares slope?',e:'$\\bar x=2,\\bar y=10/3$; $S_{xy}=3$, $S_{xx}=2$ ⇒ $a=1.5$.'},
{q:'For the same data and the line $y=1.5x+1/3$, what is the SSE (sum of squared residuals)?',e:'Residuals $0.1667,-0.3333,0.1667$ ⇒ $0.0278+0.1111+0.0278=0.1667$.'},
{q:'For the same data with $w=0,b=0$ and $\\eta=0.1$ (model $\\hat y=wx$ and MSE), what is $w$ after one GD step?',e:'$\\partial J/\\partial w=\\frac2n\\sum(\\hat y-y)x=\\frac23(-23)=-15.33$ ⇒ $w=0-0.1(-15.33)=1.5333$.'},
{q:'In the normal equation, when is $X^\\top X$ singular?',o:['When $n$ is large','When the columns of $X$ are linearly dependent','When $\\eta$ is large','Never'],e:'Dependent columns (e.g. two identical features) ⇒ rank deficiency ⇒ infinitely many solutions.'},
{q:'The least-squares residual is perpendicular to every column of $X$.',e:'From $X^\\top(X\\mathbf w-\\mathbf y)=0$.'},
{q:'Why is MSE sensitive to outliers, and what alternative do you have?',a:'The error is squared, so one very distant point contributes a lot to $J$ and pulls the line toward itself. Alternatives: the MAE loss ($|r|$), the Huber loss (quadratic near zero, linear far away), or removing/weighting outliers. These correspond to assuming heavier-tailed noise (Laplace).'}],
sum:['Supervised ML = data + model + loss + optimizer; regression has a continuous output.','Least squares: $\\mathbf w^*=(X^\\top X)^{-1}X^\\top\\mathbf y$ (orthogonal projection) or GD on the convex MSE.','$R^2=1-\\mathrm{SSE}/\\mathrm{SST}$; always inspect the residuals.']});

addEN('d1-2',{obj:['Diagnose overfitting and underfitting from the training and test error.','Explain the error curves as capacity and regularization ($\\lambda$) change.','Use learning curves to decide between more data and a simpler model.'],
body:R`
<h2>1. The goal: generalization</h2>
<p>We fit the model on training data but want it for <i>unseen</i> data. We estimate the <b>generalization error</b> with a test set never used in training. Training error is optimistic.</p>
<h2>2. Model capacity: from underfitting to overfitting</h2>
<p>Fit a degree-$d$ polynomial to $n$ noisy points. Small $d$: the model cannot capture the pattern (<b>underfitting</b>, high bias). Large $d$: it memorizes noise (<b>overfitting</b>, high variance): with $d=n-1$ it passes through every point and training error is zero. Training error always falls with capacity; test error is <b>U-shaped</b>.</p>
${wd('biasvar','Polynomial fit: underfit, overfit and the U-shaped test error')}
<h2>3. Regularization: tame the capacity</h2>
<p>Instead of shrinking the model, penalize the weights: $J_\lambda=J+\lambda\|\mathbf w\|_2^2$ (ridge). Closed form: $\mathbf w=(X^\top X+\lambda I)^{-1}X^\top\mathbf y$. $\lambda=0$ is unregularized; $\lambda\to\infty$ drives all weights to zero (underfitting). L1 (lasso) sets some weights exactly to zero.</p>
${wd('biasvar','Effect of λ (ridge) on a high-degree polynomial fit',{lam:true})}
<h2>4. Learning curves</h2>
<p>Plot training and test error against the number of samples. If both are high and close ⇒ <b>high bias</b>: more data will not help; enrich the model. If there is a big gap between training (low) and test (high) ⇒ <b>high variance</b>: more data or regularization helps.</p>
${ft(['Symptom','Diagnosis','Remedy'],[['Training and test error both high','Underfitting (bias)','Higher-capacity model, better features, smaller $\\lambda$'],['Training low, test high','Overfitting (variance)','More data, larger $\\lambda$, simpler model, early stopping'],['Both low and close','Good generalization','—']])}`,
mis:['"Zero training error means the model is excellent." ← It is often a sign of memorized noise.','"Regularization always improves accuracy." ← Too large a $\\lambda$ causes underfitting; it must be chosen by validation.','"We choose λ on the training error." ← On training data $\\lambda=0$ always wins; choose it on validation data.'],
ex:[{q:'How many parameters (coefficients) does a degree-9 polynomial have?',e:'Coefficients of $x^0$ to $x^9$ ⇒ 10.'},
{q:'Ridge regression without an intercept: $x=(1,2)$, $y=(2,4)$, $\\lambda=5$. What is $w=\\dfrac{\\sum x_iy_i}{\\sum x_i^2+\\lambda}$?',e:'$\\sum xy=2+8=10$ and $\\sum x^2=5$ ⇒ $10/(5+5)=1$ (without regularization $w=2$).'},
{q:'Training error 2% and test error 25%. What is the best first move?',o:['Make the model higher-capacity','More data or stronger regularization','Add many more features','Set $\\lambda$ to zero'],e:'A large gap ⇒ high variance ⇒ data or regularization.'},
{q:'As model capacity grows, the training error (with perfect optimization) never increases.',e:'The models are nested; more capacity contains the smaller model.'},
{q:'On a learning curve, training and test error have both converged at 30%. What helps?',o:['More data','A richer model or better features','More regularization','Early stopping'],e:'High bias: the model cannot capture the pattern; more data gives the same error.'},
{q:'Why does ridge shrink weights but not make them exactly zero, while lasso does?',a:'The gradient of the L2 penalty is $2\\lambda w$ and shrinks as $w$ shrinks, so no constant force pushes a weight to zero. The L1 penalty has subgradient $\\lambda\\,\\mathrm{sign}(w)$, independent of the size of $w$, which can drive unimportant weights exactly to zero. Geometrically, the L2 disc has no corners while the L1 diamond has corners on the axes.'}],
sum:['Training error falls with capacity and test error is U-shaped; the goal is the test minimum.','Regularization with $\\lambda$ reduces effective capacity; choose $\\lambda$ by validation.','Learning curves tell you whether the problem is bias or variance.']});

addEN('d2-1',{obj:['Build a class probability from a linear model and the sigmoid.','Derive and compute the cross-entropy loss and its gradient.','Interpret the decision boundary and train the model with GD.'],
body:R`
<h2>1. From regression to classification</h2>
<p>For a binary label $y\in\{0,1\}$ we want to predict $P(y=1\mid\mathbf x)$. The linear output $z=\mathbf w^\top\mathbf x+b$ is any real number, so we squash it into $(0,1)$ with the <b>sigmoid</b>:</p>
$$\hat p=\sigma(z)=\frac{1}{1+e^{-z}},\qquad z=\ln\frac{\hat p}{1-\hat p}\ (\text{logit})$$
<p>$\sigma(0)=0.5$; the decision boundary $z=0$ is a hyperplane (a linear boundary). We predict class 1 when $\hat p>0.5$.</p>
<h2>2. The cross-entropy loss</h2>
<p>The likelihood of a sample is $\hat p^{\,y}(1-\hat p)^{1-y}$. The mean negative log-likelihood:</p>
$$J(\mathbf w)=-\frac1n\sum_i\big[y_i\ln\hat p_i+(1-y_i)\ln(1-\hat p_i)\big]$$
<p>If the model is confidently wrong ($y=1$ and $\hat p\to0$) the loss goes to $\infty$. This is the MLE of the Bernoulli model. <b>Why not MSE?</b> With a sigmoid, MSE has almost zero gradient when the model is wrong but saturated (slow learning); cross-entropy removes that problem.</p>
<h2>3. A beautiful gradient</h2>
<p>For one sample $\partial J/\partial\mathbf w=(\hat p-y)\,\mathbf x$ and $\partial J/\partial b=\hat p-y$: "error times input", exactly like linear regression. The GD step is $\mathbf w\leftarrow\mathbf w-\eta\,\tfrac1n\sum_i(\hat p_i-y_i)\mathbf x_i$. $J$ is convex, and on separable data the weights grow without bound (regularization is needed).</p>
${wd('logreg','Logistic regression: GD steps, decision boundary and loss')}
<h2>4. Multiclass: softmax</h2>
<p>For $K$ classes we compute $K$ scores $z_k$ and $\hat p_k=e^{z_k}/\sum_je^{z_j}$. The loss is $-\ln\hat p_{y}$ and the gradient is $\hat{\mathbf p}-\mathbf y_{\text{one-hot}}$; the same is used in the last layer of neural networks.</p>
${co('note','The threshold is a choice','0.5 is only the default. In disease detection we lower the threshold to reduce false negatives (see the evaluation-metrics lesson).')}`,
mis:['"Logistic regression is a regression algorithm." ← The name is historical; it is a probabilistic classifier.','"The sigmoid output is always a calibrated probability." ← It can be overconfident; calibration is checked separately.','"The logistic decision boundary can be curved." ← Only with non-linear features; in the original feature space it is linear.'],
ex:[{q:'What is $\\sigma(z)$ for $z=\\ln 3$?',e:'$\\sigma(\\ln3)=3/(1+3)=0.75$.'},
{q:'A sample with $y=1$ and prediction $\\hat p=0.8$. What is the cross-entropy (natural log)?',e:'$-\\ln0.8=0.2231$.'},
{q:'For a sample with $x=2$, $y=1$, $\\hat p=0.8$, what is $\\partial J/\\partial w$?',e:'$(\\hat p-y)x=(0.8-1)\\cdot2=-0.4$.'},
{q:'The decision boundary $\\hat p=0.5$ is equivalent to which condition?',o:['$z=1$','$z=0$','$z=0.5$','$\\mathbf w=0$'],e:'$\\sigma(z)=0.5\\iff z=0$.'},
{q:'Cross-entropy goes to infinity for $y=1$ and $\\hat p\\to0$.',e:'$-\\ln\\hat p\\to\\infty$; a confident mistake is punished severely.'},
{q:'Show that the gradient of cross-entropy + sigmoid with respect to $z$ is $\\hat p-y$ and explain why that is good for learning.',a:'$\\partial J/\\partial\\hat p=-y/\\hat p+(1-y)/(1-\\hat p)$ and $\\partial\\hat p/\\partial z=\\hat p(1-\\hat p)$. Multiplying: $-y(1-\\hat p)+(1-y)\\hat p=\\hat p-y$. Because the factor $\\hat p(1-\\hat p)$ cancels, even when the sigmoid is saturated (and its derivative tiny) the gradient is still proportional to the error, so learning does not stall; with MSE this cancellation does not happen.'}],
sum:['$\\hat p=\\sigma(\\mathbf w^\\top\\mathbf x+b)$; the decision boundary is linear.','Cross-entropy = Bernoulli MLE; gradient $(\\hat p-y)\\mathbf x$.','Multiclass: softmax with gradient $\\hat{\\mathbf p}-\\mathbf y$.']});

addEN('d2-2',{obj:['Run k-NN and explain the effect of $k$ and of feature scale.','Compute Gini impurity and information gain for a split.','Relate tree depth to overfitting and state the idea of a random forest.'],
body:R`
<h2>1. k-NN: the most similar samples vote</h2>
<p>For a new point $\mathbf x$, find the $k$ nearest training samples (Euclidean distance) and return the majority vote (or the mean for regression). There is no training; all the work happens at prediction time ($O(nd)$). $k=1$ memorizes the training data (high variance, jagged boundary); large $k$ smooths the boundary and in the limit $k=n$ always predicts the majority class (high bias).</p>
${wd('knn','k-NN: decision boundary and train/test accuracy versus k')}
${co('warn','Feature scale and the curse of dimensionality','Distance is dominated by large-scale features; standardize the features before k-NN. In high dimensions all points become nearly equidistant and "nearest" loses meaning.')}
<h2>2. Decision tree: a chain of questions</h2>
<p>The tree splits space into rectangles with axis-aligned cuts ($x_j<t$?) and predicts the majority in each leaf. We choose the best cut greedily by the drop in <b>impurity</b>. For a node with class proportions $p_c$:</p>
$$G=1-\sum_cp_c^2,\qquad H=-\sum_cp_c\ln p_c$$
<p>Example: a node with 6 positives and 2 negatives has $G=1-(0.75^2+0.25^2)=0.375$. A split into $(4^+,0^-)$ and $(2^+,2^-)$ has weighted Gini $\tfrac48\cdot0+\tfrac48\cdot0.5=0.25$; the <b>gain</b> is $0.375-0.25=0.125$.</p>
${wd('dtree','Decision tree on ring data: depth, leaves, and train/test accuracy')}
<h2>3. Overfitting and the random forest</h2>
<p>An unrestricted tree memorizes every sample (high variance). Controls: maximum depth, minimum samples per leaf, pruning. A <b>random forest</b> trains hundreds of trees on bootstrap samples with random feature subsets and takes a vote; averaging reduces variance without raising bias much.</p>
${ft(['','k-NN','Decision tree'],[['Training','None (memory)','Greedy, $O(nd\\log n)$'],['Boundary','Any shape; sensitive to scale','Rectangular; no scaling needed'],['Interpretability','Low','High (if-then rules)'],['Weakness','High dimensions, slow prediction','Unstable; overfits']])}`,
mis:['"k=1 is best because training accuracy is 100%." ← That is memorized noise; look at test accuracy.','"A deeper tree is always better." ← Beyond a suitable depth the test error rises.','"Gini and entropy give very different results." ← In practice they are almost identical.'],
ex:[{q:'What is the Gini impurity of a node with 6 positives and 2 negatives?',e:'$1-(0.75^2+0.25^2)=0.375$.'},
{q:'The same node splits into $(4^+,0^-)$ and $(2^+,2^-)$. What is the Gini gain?',e:'Weighted $=0.5\\cdot0+0.5\\cdot0.5=0.25$; $0.375-0.25=0.125$.'},
{q:'What does k-NN classification predict when $k=n$?',o:['The nearest neighbour','The majority class of all the data','A random class','The minority class'],e:'All samples vote.'},
{q:'k-NN needs features on a comparable scale.',e:'Euclidean distance is scale-sensitive.'},
{q:'Which method reduces the variance of trees?',o:['Increasing depth','Averaging bootstrap trees (random forest)','Removing features','Reducing data'],e:'Bagging; averaging fairly uncorrelated errors reduces them.'},
{q:'Why does k-NN usually get worse in very high dimensions?',a:'In high dimensions volume grows so fast that fixed data is extremely sparse; the distances to the nearest and farthest points become nearly equal (distance concentration), so "nearest neighbour" carries little information. Remedies: dimensionality reduction (PCA), feature selection, or a learned metric.'}],
sum:['k-NN: neighbours vote; $k$ sets the bias–variance trade-off; scaling is required.','Tree: greedy cuts with Gini/entropy; depth = capacity.','A random forest reduces variance by averaging.']});

addEN('d3-1',{obj:['Run Lloyd\'s algorithm (assign and update) step by step.','Explain the inertia objective and convergence to a local minimum.','Choose $k$ with the elbow method and list the limits of k-means.'],
body:R`
<h2>1. Unsupervised learning</h2>
<p>There are no labels; we want to find hidden structure. <b>Clustering</b> partitions the samples into $k$ groups so that samples in a group are more similar to each other. k-means represents each group by a <b>centroid</b> $\boldsymbol\mu_c$ and minimizes</p>
$$J=\sum_{i=1}^n\|\mathbf x_i-\boldsymbol\mu_{c(i)}\|^2\quad(\text{inertia})$$
<h2>2. Lloyd's algorithm</h2>
<ol><li><b>Initialize:</b> $k$ centroids (e.g. $k$ random samples).</li><li><b>Assign:</b> each sample to the nearest centroid.</li><li><b>Update:</b> each centroid = the mean of its members.</li><li>Repeat 2–3 until the assignments stop changing.</li></ol>
<p>Each step lowers $J$ or leaves it unchanged (assignment is optimal for fixed centroids, and the mean minimizes $J$ for fixed assignments), so the algorithm converges, but only to a <b>local minimum</b>. Each iteration costs $O(nkd)$.</p>
${wd('kmeans','k-means step by step: assign, update, inertia and k')}
<h2>3. A one-dimensional example</h2>
<p>Points $\{1,2,3,10,11\}$, initial centroids $\mu_1=0,\mu_2=5$. Assign: $\{1,2\}\to\mu_1$ and $\{3,10,11\}\to\mu_2$; new centroids $1.5$ and $8$. Reassign: 3 now goes to $\mu_1$ (distance $1.5<5$); centroids $2$ and $10.5$, $J=2+0.5=2.5$ and stable.</p>
<h2>4. Choosing k and the limits</h2>
<p>$J$ always decreases as $k$ grows (it is zero at $k=n$). Plot $J$ against $k$ and look for the "elbow", or maximize the <b>silhouette</b> score. Limits: it assumes spherical clusters of similar size, is sensitive to scale and outliers, and depends on initialization (remedy: k-means++ and several runs).</p>
${co('note','k-means++','Chooses well-spread initial centroids: each next centroid is picked with probability proportional to the squared distance from the nearest existing centroid. It guarantees an $O(\\log k)$ approximation of the optimum.')}`,
mis:['"k-means always finds the best clustering." ← Only a local minimum; it depends on initialization.','"Quality always improves as k grows." ← Inertia drops but clusters become meaningless.','"k-means works for any cluster shape." ← It cannot recognize non-spherical clusters (e.g. two moons).'],
ex:[{q:'Points 1, 2, 3, 10, 11 and initial centroids 0 and 5. After the first update, what is the second centroid?',e:'$\\{3,10,11\\}\\to\\mu_2$ ⇒ $(3+10+11)/3=8$.'},
{q:'For the same example, what is the final inertia after convergence?',e:'Centroids $2$ and $10.5$: $(1+0+1)+(0.25+0.25)=2.5$.'},
{q:'In the update step of k-means, what does each centroid become?',o:['The median of its members','The mean of its members','The nearest member','A random member'],e:'The mean minimizes the sum of squared distances.'},
{q:'k-means reaches the same solution from every initialization.',e:'It finds local minima; the solution depends on the initialization.'},
{q:'In a plot of $J$ against $k$, what is the "elbow"?',o:['The point where $J$ becomes zero','The point where the decrease of $J$ clearly slows','The maximum of $J$','$k=n$'],e:'After the elbow an extra cluster adds little.'},
{q:'Why do we standardize features before k-means?',a:'k-means relies on Euclidean distance. A large-scale feature (say income in a small currency unit) dominates the distance and small-scale features (say age) become irrelevant. Standardization (zero mean, unit variance) gives every feature an equal say, unless we deliberately want weights.'}],
sum:['k-means: assign to the nearest centroid + average; objective inertia.','Converges to a local minimum; use k-means++ and several runs.','Choose $k$ by elbow/silhouette; scale the features.']});

addEN('d3-2',{obj:['State PCA as maximizing the projected variance (and minimizing the reconstruction error).','Obtain the principal components from the covariance matrix or the SVD.','Compute the explained-variance ratio and choose a suitable $k$.'],
body:R`
<h2>1. Why reduce dimension?</h2>
<p>$d$-dimensional data often lies close to a lower-dimensional subspace (correlated features). Dimensionality reduction helps visualization, denoising, compression and fighting the curse of dimensionality. PCA finds the best <b>linear subspace</b>.</p>
<h2>2. The idea: the direction that maximizes variance</h2>
<p>Center the data ($\bar{\mathbf x}=0$). The projection onto a unit direction $\mathbf u$ is $\mathbf u^\top\mathbf x$ with variance $\mathbf u^\top\Sigma\mathbf u$, where $\Sigma=\tfrac1nX^\top X$ is the covariance matrix. The problem:</p>
$$\max_{\|\mathbf u\|=1}\mathbf u^\top\Sigma\mathbf u\ \Rightarrow\ \Sigma\mathbf u=\lambda\mathbf u$$
<p>The solution is the eigenvector of the largest eigenvalue ($\lambda_1$ = the variance along $\mathbf u_1$). Later vectors are perpendicular to the earlier ones. Equivalently, maximizing projected variance minimizes the sum of squared distances from points to their projections (the reconstruction error), by Pythagoras: $\|\mathbf x\|^2=\text{projected variance}+\text{reconstruction error}$.</p>
${wd('pca','PCA: rotate the projection angle and watch the variance; PC1 is the maximum')}
<h2>3. Algorithm and explained variance</h2>
<ol><li>Center (and standardize if needed).</li><li>$\Sigma$ or the SVD: $X=U S V^\top$; the columns of $V$ are the components and $\lambda_i=s_i^2/n$.</li><li>Keep the first $k$ components; reduced data $Z=XV_k\in\mathbb{R}^{n\times k}$.</li></ol>
$$\text{explained variance ratio}=\frac{\sum_{i\le k}\lambda_i}{\sum_{i=1}^d\lambda_i}$$
<p>Example: $\Sigma=\begin{pmatrix}4&2\\2&1\end{pmatrix}$ has $\mathrm{tr}=5$ and $\det=0$ ⇒ $\lambda=5,0$; the first component $(2,1)/\sqrt5$ captures all (100%) of the variance (the data lies exactly on a line).</p>
${co('warn','Limitations','PCA is linear and scale-sensitive; high-variance directions are not necessarily "important for prediction"; it cannot see nonlinear structure (such as a spiral) (remedies: kernel PCA, t-SNE/UMAP for visualization).')}`,
mis:['"Principal components are the main original features." ← They are linear combinations of all the features.','"PCA is fine without scaling." ← Features with large units take over the first component.','"High variance means useful information." ← High-variance noise exists too.'],
ex:[{q:'Covariance matrix $\\begin{pmatrix}4&2\\\\2&1\\end{pmatrix}$. What is the largest eigenvalue?',e:'$\\mathrm{tr}=5$ and $\\det=0$ ⇒ $\\lambda=5,0$.'},
{q:'The covariance eigenvalues are $6,3,1$. What fraction of the variance do the first two components explain?',e:'$(6+3)/10=0.9$.'},
{q:'$100\\times5$ data is reduced to $k=2$ components with PCA. How many numbers are in the reduced data $Z$?',e:'$Z\\in\\mathbb R^{100\\times2}$ ⇒ 200.'},
{q:'What is the first principal component?',o:['The direction of least variance','The direction of greatest projected variance','The $x$ axis','The data mean'],e:'The eigenvector of the largest eigenvalue of $\\Sigma$.'},
{q:'Principal components are perpendicular to each other.',e:'Eigenvectors of a symmetric matrix with distinct eigenvalues are orthogonal.'},
{q:'How are PCA and the SVD of the centered data matrix related?',a:'If $X=USV^\\top$ then $\\Sigma=\\tfrac1nX^\\top X=V\\,(S^2/n)\\,V^\\top$; so the columns of $V$ are the covariance eigenvectors (principal components) and $s_i^2/n$ are the eigenvalues. The SVD is more stable than forming $\\Sigma$ explicitly and is used for large matrices; the projection onto $k$ components is $XV_k=U_kS_k$.'}],
sum:['PCA: orthogonal directions of greatest variance = eigenvectors of the covariance (or $V$ in the SVD).','Explained variance ratio: $\\sum_{i\\le k}\\lambda_i/\\sum\\lambda_i$.','Linear and scale-sensitive; maximum variance ≡ minimum reconstruction error.']});

addEN('d4-1',{obj:['Explain the roles of the training, validation and test sets.','Run $K$-fold cross-validation and report the mean and standard deviation.','Choose a hyperparameter without looking at the test set.'],
body:R`
<h2>1. Three sets, three roles</h2>
<ul><li><b>Training:</b> to fit the parameters.</li><li><b>Validation:</b> to choose hyperparameters ($\lambda$, $k$, depth…) and the model.</li><li><b>Test:</b> once, at the end, to report the generalization error. If you decide anything based on it, it is no longer unbiased.</li></ul>
<h2>2. $K$-fold cross-validation</h2>
<p>With little data a single fixed split is noisy. Split the data into $K$ folds; $K$ times validate on one fold and train on the rest, and average the error:</p>
$$\mathrm{CV}_K=\frac1K\sum_{k=1}^K\mathrm{err}_k$$
<p>Cost: $K$ trainings. Typically $K=5$ or 10. For imbalanced classification use stratified folds. Example: the 5-fold scores $0.82,0.80,0.84,0.78,0.86$ have mean $0.82$ and sample standard deviation $0.0316$; that spread is the uncertainty of the estimate.</p>
${wd('cvfold','Cross-validation: the best polynomial degree without seeing the test set')}
<h2>3. Hyperparameter search</h2>
<p><b>Grid search:</b> a grid of all combinations (with 4 values and $K=5$: 20 trainings per hyperparameter). <b>Random search:</b> random sampling; more efficient when only a few hyperparameters matter. After choosing, refit the final model on training+validation and evaluate once on the test set.</p>
<h2>4. Data leakage</h2>
<p>Any information from validation/test that gets into training makes the error optimistic. Examples: standardizing on all the data before the split; duplicate samples in two sets; a feature that gives the answer away. Fix: learn every preprocessing step <b>inside</b> each training fold (a pipeline).</p>
${co('warn','CV and temporal data','Time-series samples are not independent; use a temporal split (train on the past, validate on the future), not a random shuffle.')}`,
mis:['"I can compare several models on the test error and pick the best." ← The test set then becomes a validation set and is optimistic.','"I\'ll standardize before the split to keep it simple." ← Leakage: test mean/variance reach training.','"A larger $K$ is always better." ← The cost grows and the variance of the estimate may not shrink.'],
ex:[{q:'5-fold scores: $0.82,0.80,0.84,0.78,0.86$. What is the mean?',e:'The sum 4.10 divided by 5 = 0.82.'},
{q:'For the same scores, what is the sample standard deviation (denominator $K-1$)?',e:'Deviations $0,-0.02,0.02,-0.04,0.04$; sum of squares $0.004$; variance $0.001$; root $0.0316$.'},
{q:'How many times does a grid search with 4 hyperparameter values and 5-fold CV train the model?',e:'$4\\times5=20$.'},
{q:'Which is data leakage?',o:['Standardizing on training data and applying the same parameters to the test set','Standardizing with the mean of all data before the split','A stratified split','5-fold CV'],e:'Test statistics entered the training.'},
{q:'The test set should be used to choose hyperparameters.',e:'Use validation/CV for choosing.'},
{q:'Why use stratified CV for classification with 5% positives?',a:'With a plain random split some folds may contain almost no positives, so their scores become meaningless or highly variable. Stratification keeps the class proportions about equal in every fold, giving a more stable, unbiased estimate.'}],
sum:['Training for parameters, validation for hyperparameters, test once for the final report.','$K$-fold CV: mean and spread of the error; stratified for small and imbalanced data.','Learn preprocessing inside the folds so nothing leaks.']});

addEN('d4-2',{obj:['Build the confusion matrix and compute precision, recall, F1 and accuracy.','Explain why accuracy is insufficient on imbalanced data.','Interpret the effect of the threshold with ROC and AUC.'],
body:R`
<h2>1. The confusion matrix</h2>
<p>For binary classification: TP (true positive), FP (false positive), FN (false negative), TN (true negative).</p>
$$\text{Precision}=\frac{TP}{TP+FP},\quad \text{Recall}=\frac{TP}{TP+FN},\quad F_1=\frac{2PR}{P+R},\quad \text{Accuracy}=\frac{TP+TN}{n}$$
<p>Precision: "of the positives I announced, how many were right?" Recall: "of the real positives, how many did I catch?" $F_1$ is their harmonic mean and needs both to be high.</p>
<p>Example: $TP=40,FP=10,FN=20,TN=930$ ⇒ $P=0.8$, $R=0.667$, $F_1=0.727$, accuracy $=0.97$.</p>
<h2>2. The accuracy trap on imbalanced data</h2>
<p>If 5% of samples are positive, a model that always says "negative" has 95% accuracy but finds no positive ($R=0$). For rare-event problems (fraud, disease) report precision, recall and the PR curve.</p>
<h2>3. Threshold, ROC and AUC</h2>
<p>The model outputs a probability and a threshold $\tau$ decides. Lowering $\tau$ raises recall and usually lowers precision. The <b>ROC</b> curve plots the true-positive rate $TPR=R$ against the false-positive rate $FPR=FP/(FP+TN)$ for all thresholds; the <b>AUC</b> is the area under it and equals the probability that a random positive gets a higher score than a random negative ($0.5$ = random guessing, $1$ = perfect).</p>
${wd('confusion','Confusion matrix, precision/recall and ROC with threshold, separation and prevalence')}
${co('note','Which metric?','Fraud/disease: high recall (and acceptable precision). Spam filter: high precision (mistaking an important message is costly). Always choose the metric from the business cost of each error.')}`,
mis:['"99% accuracy means an excellent model." ← On imbalanced data it can be worthless.','"AUC is insensitive to imbalance so it is always fine." ← AUC becomes optimistic; PR-AUC is more informative for rare events.','"A threshold of 0.5 is optimal." ← It is tuned to costs and prevalence.'],
ex:[{q:'$TP=40,FP=10$. What is the precision?',e:'$40/50=0.8$.'},
{q:'$TP=40,FN=20$. What is the recall?',e:'$40/60=0.667$.'},
{q:'With $P=0.8$ and $R=2/3$, what is $F_1$?',e:'$2\\cdot0.8\\cdot0.6667/(1.4667)=0.7273$.'},
{q:'In a data set with 1000 samples and 50 positives a model says negative for everything. What is its accuracy?',e:'$950/1000=0.95$ but recall is 0.'},
{q:'For detecting a dangerous disease which metric do you weight more?',o:['Precision','Recall','Accuracy','None'],e:'A false negative (missing a patient) is costlier.'},
{q:'What does AUC = 0.5 mean, and when can AUC be high while precision is low?',a:'AUC = 0.5: the model ranks positives and negatives no better than chance (the ROC is the diagonal). If the positive class is very rare, even a small FPR produces many false positives (there are so many negatives), so precision is low while ROC/AUC looks high. That is why we also look at the PR curve for very imbalanced data.'}],
sum:['Precision, recall, $F_1$ and accuracy come from the confusion matrix; accuracy misleads on imbalanced data.','The threshold trades precision against recall; ROC/AUC summarize all thresholds.','Choose the metric from the cost of errors.']});

addEN('d5-1',{obj:['Compute the output of a neuron and of a 2-layer network (the forward pass).','Explain why XOR is not separable by a linear model but is with one hidden layer.','Count a network\'s parameters and state the role of the activation function.'],
body:R`
<h2>1. A neuron = a linear model + a nonlinearity</h2>
<p>A neuron is $a=\phi(\mathbf w^\top\mathbf x+b)$. With $\phi=\sigma$ it is logistic regression. Common activations: $\tanh$, ReLU ($\max(0,z)$), sigmoid. Without $\phi$ any stack of linear layers is again linear, so depth adds nothing.</p>
<h2>2. XOR: a linear boundary is not enough</h2>
<p>The XOR points ($(\pm1,\pm1)$ labelled by whether the signs differ) cannot be separated by any line. A hidden layer with several neurons builds one linear boundary each and the output layer combines them; the result is a nonlinear boundary.</p>
${wd('mlp2d','2D MLP: try 0 hidden units, then 2 and 4; XOR, rings and moons')}
<h2>3. The MLP</h2>
<p>For $L$ layers: $\mathbf a^{(l)}=\phi\big(W^{(l)}\mathbf a^{(l-1)}+\mathbf b^{(l)}\big)$ with $\mathbf a^{(0)}=\mathbf x$. A $2\to4\to1$ network has $2\cdot4+4+4\cdot1+1=17$ parameters. A one-neuron numeric example: $\mathbf w=(0.5,-1)$, $b=0.2$, $\mathbf x=(2,1)$ ⇒ $z=1-1+0.2=0.2$; $\tanh(0.2)=0.197$ and ReLU$(0.2)=0.2$.</p>
<h2>4. Training and capacity</h2>
<p>We minimize the loss with backprop (the chain rule) and GD/SGD (see the optimization lessons and X7). <b>The universal approximation theorem:</b> one hidden layer with enough neurons can approximate any continuous function on a compact set arbitrarily well; but it does not say how many neurons are needed or that training will find it. Depth often makes the representation far more compact.</p>
${co('note','ReLU and its derivative','ReLU has derivative 1 for $z>0$ (the gradient does not vanish) and is cheap; but a neuron stuck at $z<0$ "dies". tanh/sigmoid have small gradients in the saturated region.')}`,
mis:['"A deeper network is always better." ← Overfitting and harder training; validate.','"Without an activation function a deep network can still solve XOR." ← A composition of linear maps is linear.','"The universal approximation theorem means any small network learns any function." ← It guarantees only existence.'],
ex:[{q:'A neuron with $\\mathbf w=(0.5,-1)$, $b=0.2$ and $\\mathbf x=(2,1)$: what is $z$?',e:'$1-1+0.2=0.2$.'},
{q:'How many parameters (with biases) does a $2\\to4\\to1$ network have?',e:'$2\\cdot4+4+4\\cdot1+1=17$.'},
{q:'How many parameters (with biases) does a $784\\to128\\to10$ network have?',e:'$784\\cdot128+128+128\\cdot10+10=100352+128+1280+10=101770$.'},
{q:'Why is a multi-layer network without a nonlinear activation just a linear model?',o:['Because the weights are small','Because a composition of linear maps is linear','Because the loss is convex','Because there is little data'],e:'$W_2(W_1\\mathbf x)=(W_2W_1)\\mathbf x$.'},
{q:'XOR can be separated by logistic regression on the original features.',e:'The decision boundary is linear and XOR is not linearly separable.'},
{q:'Why does ReLU usually train better than sigmoid in deep networks?',a:'The sigmoid derivative is at most 0.25 and near zero in the saturated region; multiplying many layers shrinks the gradient severely (vanishing gradient). ReLU has derivative exactly 1 for positive inputs, so the gradient passes without shrinking, it is cheap to compute and it creates sparse activations. Drawback: dead neurons.'}],
sum:['A neuron is $\\phi(\\mathbf w^\\top\\mathbf x+b)$; the nonlinearity is essential.','A hidden layer builds nonlinear boundaries (like XOR); we count parameters.','Training is backprop; universal approximation guarantees existence, not learning.']});

addEN('d5-2',{obj:['Compute a 2D convolution on a small image by hand.','Find the output size and the parameter count of a convolutional layer.','Explain weight sharing, pooling and the receptive field.'],
body:R`
<h2>1. Why a Dense layer is wrong for images</h2>
<p>A $28\times28$ image with even a single 128-unit hidden layer needs over $100{,}000$ weights and ignores spatial structure: an edge at each position would have to be learned separately. A CNN builds two assumptions into the network: <b>locality</b> (patterns live in small regions) and <b>weight sharing</b> (the same detector everywhere).</p>
<h2>2. Convolution (really cross-correlation)</h2>
<p>Slide a $3\times3$ kernel over the image; at each position multiply element-wise and sum:</p>
$$Y_{ij}=b+\sum_{u,v}K_{uv}\,X_{i s+u-p,\ j s+v-p}$$
<p>$s$ is the stride and $p$ the zero padding. The output is a <b>feature map</b>. The "vertical edge" kernel $\begin{pmatrix}-1&0&1\\-1&0&1\\-1&0&1\end{pmatrix}$ responds strongly only where brightness changes from left to right.</p>
${wd('conv2d','Convolution: 8×8 image, 3×3 kernel, padding and stride')}
<h2>3. Output size and parameters</h2>
$$n_{\text{out}}=\left\lfloor\frac{n+2p-k}{s}\right\rfloor+1,\qquad \#\text{params}=(k\cdot k\cdot C_{in}+1)\,C_{out}$$
<p>Examples: $n=32,k=5,p=2,s=1\Rightarrow32$ (same size). $n=28,k=3,p=0,s=2\Rightarrow\lfloor25/2\rfloor+1=13$. A $3\times3$ layer with 16 input and 32 output channels: $(9\cdot16+1)\cdot32=4640$ parameters, independent of the image size.</p>
<h2>4. Pooling, receptive field and architecture</h2>
<p>$2\times2$ <b>max pooling</b> with stride 2 halves the size and adds a little shift tolerance. With stacked layers the <b>receptive field</b> of a neuron grows (two $3\times3$ layers see $5\times5$). A common architecture: [convolution→ReLU→pooling]×several → Flatten → Dense → softmax. Early layers detect edges, middle ones textures and parts, late ones objects.</p>
${co('note','Equivariance','Convolution is translation-equivariant: shift the image and the feature map shifts by the same amount. Pooling adds a little invariance.')}`,
mis:['"CNNs are only for images." ← Also for any grid-like/sequential data (audio, text, 1D).','"Each filter sees one specific location." ← The same filter is applied at every location.','"Padding always preserves the size." ← Only when $p=(k-1)/2$ and $s=1$.'],
ex:[{q:'Input $n=32$, kernel $k=5$, $p=2$, $s=1$. Output size?',e:'$\\lfloor(32+4-5)/1\\rfloor+1=32$.'},
{q:'Input $28$, kernel $3$, $p=0$, $s=2$. Output size?',e:'$\\lfloor25/2\\rfloor+1=13$.'},
{q:'How many parameters (with bias) does a $3\\times3$ convolution with 16 input channels and 32 output channels have?',e:'$(9\\cdot16+1)\\cdot32=145\\cdot32=4640$.'},
{q:'What is the receptive field of two stacked $3\\times3$ layers (stride 1)?',o:['$3\\times3$','$5\\times5$','$6\\times6$','$9\\times9$'],e:'Each extra layer adds $k-1=2$: $3+2=5$.'},
{q:'In a convolutional layer one kernel with the same weights is used at every image position.',e:'Weight sharing.'},
{q:'Compare the parameter count of a Dense layer from a $28\\times28$ image to 128 units with a $3\\times3$ convolution with 128 filters.',a:'Dense: $784\\cdot128+128=100{,}480$. Convolution (1 input channel): $(9\\cdot1+1)\\cdot128=1280$. The convolution keeps the parameters about 80 times smaller because weights are shared across positions and act only locally; this reduces overfitting and exploits spatial structure. The price is more computation (each kernel is evaluated at every position).'}],
sum:['Convolution: a local kernel with shared weights; $n_{out}=\\lfloor(n+2p-k)/s\\rfloor+1$.','Parameters $(k^2C_{in}+1)C_{out}$, independent of image size.','Pooling shrinks the map and grows the receptive field; architecture: [conv→ReLU→pool]×several + Dense.']});
